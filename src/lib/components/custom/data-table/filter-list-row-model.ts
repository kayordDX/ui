import {
	constructRow,
	makeObjectMap,
	skipFirstRun,
	tableMemo,
	type Row,
	type RowData,
	type RowModel,
	type Table,
	type TableFeatures,
} from "@tanstack/svelte-table";
import {
	applyFilterOperator,
	isExtendedColumnFilter,
	isInactiveFilter,
	type ExtendedColumnFilter,
	type JoinOperator,
} from "./filter-list-utils";

type FilterListTable = Table<TableFeatures, any> & { autoResetPageIndex: () => void };
type FilterListRow = Row<TableFeatures, any>;
type FilterListRowModel = RowModel<TableFeatures, any>;

/**
 * Drop-in replacement for TanStack's `createFilteredRowModel` that understands
 * the extended column filters written by `DataTableFilterList`:
 *
 * - filters carrying an `operator` are evaluated by `applyFilterOperator`
 * - `joinOperator` combines filters left-to-right (`and` / `or`)
 * - plain `{ id, value }` filters keep stock semantics (the column's
 *   `filterFn`), and the global filter keeps stock "matches any column" logic
 */
export function createFilterListRowModel<TData extends RowData>() {
	return (table: FilterListTable) => {
		return tableMemo({
			feature: "columnFilteringFeature",
			table,
			fnName: "table.getFilteredRowModel",
			memoDeps: () => [
				table.getPreFilteredRowModel(),
				table.atoms.columnFilters?.get(),
				table.atoms.globalFilter?.get(),
			],
			fn: () => createFilterListModel(table),
			onAfterUpdate: skipFirstRun(() => table.autoResetPageIndex()),
		}) as unknown as () => RowModel<TableFeatures, TData>;
	};
}

function createFilterListModel(table: FilterListTable) {
	const rowModel = table.getPreFilteredRowModel();
	const columnFilters = (table.atoms.columnFilters?.get() ?? []) as Array<ExtendedColumnFilter>;
	const globalFilter = table.atoms.globalFilter?.get();
	const hasGlobalFilter = globalFilter !== undefined && globalFilter !== null && globalFilter !== "";

	if (!rowModel.rows.length || (!columnFilters.length && !hasGlobalFilter)) {
		const flatRows = rowModel.flatRows;
		for (let i = 0; i < flatRows.length; i++) {
			const row = flatRows[i];
			row.columnFilters = makeObjectMap();
			row.columnFiltersMeta = makeObjectMap();
		}
		return rowModel;
	}

	const evaluators: Array<{ id: string; join: JoinOperator; evaluate: (row: FilterListRow) => boolean }> = [];
	for (const filter of columnFilters) {
		const column = table.getColumn(filter.id);
		if (!column) continue;

		if (isExtendedColumnFilter(filter) && filter.operator) {
			const operator = filter.operator;
			evaluators.push({
				id: filter.id,
				join: filter.joinOperator ?? "and",
				evaluate: isInactiveFilter(filter)
					? () => true
					: (row: FilterListRow) => applyFilterOperator(row.getValue(filter.id), operator, filter.value),
			});
		} else {
			const filterFn = column.getFilterFn();
			if (!filterFn) continue;
			evaluators.push({
				id: filter.id,
				join: "and",
				evaluate: (row: FilterListRow) => {
					const resolvedValue = filterFn.resolveFilterValue?.(filter.value) ?? filter.value;
					return (
						filterFn(row, filter.id, resolvedValue, (meta) => {
							if (!row.columnFiltersMeta) row.columnFiltersMeta = makeObjectMap();
							row.columnFiltersMeta[filter.id] = meta;
						}) !== false
					);
				},
			});
		}
	}

	const globalFilterFn = table.getGlobalFilterFn();
	const hasGlobalFilterFn = typeof globalFilterFn === "function";
	const globallyFilterableColumns =
		hasGlobalFilter && hasGlobalFilterFn
			? table.getAllLeafColumns().filter((column) => column.getCanGlobalFilter())
			: [];

	const passesById = new Map<string, boolean>();
	const flatRows = rowModel.flatRows;
	for (let i = 0; i < flatRows.length; i++) {
		const row = flatRows[i];
		row.columnFilters = makeObjectMap();
		row.columnFiltersMeta = makeObjectMap();

		let combined = true;
		for (let j = 0; j < evaluators.length; j++) {
			const pass = evaluators[j].evaluate(row);
			row.columnFilters[evaluators[j].id] = pass;
			combined = j === 0 ? pass : evaluators[j].join === "or" ? combined || pass : combined && pass;
		}

		if (globallyFilterableColumns.length) {
			let globalPass = false;
			for (const column of globallyFilterableColumns) {
				if (globalFilterFn!(row, column.id, globalFilter, () => {}) !== false) {
					globalPass = true;
					break;
				}
			}
			row.columnFilters.__global__ = globalPass;
			combined = combined && globalPass;
		}

		passesById.set(row.id, combined);
	}

	return filterRows(rowModel.rows, (row) => passesById.get(row.id) ?? false, table);
}

function filterRows(
	rows: FilterListRow[],
	filterRowImpl: (row: FilterListRow) => boolean,
	table: FilterListTable
): FilterListRowModel {
	if (table.options.filterFromLeafRows) return filterRowModelFromLeafs(rows, filterRowImpl, table);
	return filterRowModelFromRoot(rows, filterRowImpl, table);
}

function filterRowModelFromLeafs(
	rowsToFilter: FilterListRow[],
	filterRow: (row: FilterListRow) => boolean,
	table: FilterListTable
): FilterListRowModel {
	const newFilteredFlatRows: FilterListRow[] = [];
	const newFilteredRowsById = makeObjectMap<FilterListRow>();
	const maxDepth = table.options.maxLeafRowFilterDepth ?? 100;
	const recurseFilterRows = (rowsToFilter: FilterListRow[], depth = 0) => {
		const filteredRows: FilterListRow[] = [];
		for (let row of rowsToFilter) {
			const newRow = constructRow(table, row.id, row.original, row.index, row.depth, undefined, row.parentId);
			newRow.columnFilters = row.columnFilters;
			if (row.subRows.length && depth < maxDepth) {
				newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
				row = newRow;
				if (filterRow(row) && !newRow.subRows.length) {
					filteredRows.push(row);
					newFilteredRowsById[row.id] = row;
					newFilteredFlatRows.push(row);
					continue;
				}
				if (filterRow(row) || newRow.subRows.length) {
					filteredRows.push(row);
					newFilteredRowsById[row.id] = row;
					newFilteredFlatRows.push(row);
					continue;
				}
			} else {
				row = newRow;
				if (filterRow(row)) {
					filteredRows.push(row);
					newFilteredRowsById[row.id] = row;
					newFilteredFlatRows.push(row);
				}
			}
		}
		return filteredRows;
	};
	return {
		rows: recurseFilterRows(rowsToFilter),
		flatRows: newFilteredFlatRows,
		rowsById: newFilteredRowsById,
	};
}

function filterRowModelFromRoot(
	rowsToFilter: FilterListRow[],
	filterRow: (row: FilterListRow) => boolean,
	table: FilterListTable
): FilterListRowModel {
	const newFilteredFlatRows: FilterListRow[] = [];
	const newFilteredRowsById = makeObjectMap<FilterListRow>();
	const maxDepth = table.options.maxLeafRowFilterDepth ?? 100;
	const recurseFilterRows = (rowsToFilter: FilterListRow[], depth = 0) => {
		const filteredRows: FilterListRow[] = [];
		for (let row of rowsToFilter) {
			if (filterRow(row)) {
				if (row.subRows.length && depth < maxDepth) {
					const newRow = constructRow(table, row.id, row.original, row.index, row.depth, undefined, row.parentId);
					newRow.subRows = recurseFilterRows(row.subRows, depth + 1);
					row = newRow;
				}
				filteredRows.push(row);
				newFilteredFlatRows.push(row);
				newFilteredRowsById[row.id] = row;
				if (row.subRows.length && depth >= maxDepth) {
					addSubRowsToFlatArrays(row.subRows, newFilteredFlatRows, newFilteredRowsById);
				}
			}
		}
		return filteredRows;
	};
	return {
		rows: recurseFilterRows(rowsToFilter),
		flatRows: newFilteredFlatRows,
		rowsById: newFilteredRowsById,
	};
}

function addSubRowsToFlatArrays(
	subRows: FilterListRow[],
	flatRows: FilterListRow[],
	rowsById: Record<string, FilterListRow>
) {
	for (const subRow of subRows) {
		flatRows.push(subRow);
		rowsById[subRow.id] = subRow;
		if (subRow.subRows.length) addSubRowsToFlatArrays(subRow.subRows, flatRows, rowsById);
	}
}
