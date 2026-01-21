import { createSubscriber } from "svelte/reactivity";
import {
	createTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	type RowData,
	type TableOptions,
	type TableOptionsResolved,
	type Table,
	type SortingState,
	type ColumnFiltersState,
	type RowSelectionState,
	type ColumnPinningState,
	type VisibilityState,
	type ColumnSizingState,
	type ColumnSizingInfoState,
	type PaginationState,
	type ColumnDef,
	type GlobalFilterTableState,
} from "@tanstack/table-core";
import type { DataGridOptions, DataGridResponse } from "./types";
import { defaultDataGridProps } from "./types";
import { renderComponent } from "$lib/data-table";
import DataGridCheckbox from "./DataGridCheckbox.svelte";

export function createGrid<TData extends RowData>(options: DataGridOptions<TData>): DataGridResponse<TData> {
	// Merge provided dataGridProps with defaults. If none provided, use defaults.
	options.dataGridProps = { ...defaultDataGridProps, ...(options.dataGridProps ?? {}) };

	const { columns, data: dataProp, initialState, dataGridProps } = options;

	// Support both direct data array and getter function for reactivity
	// Using a getter function () => data allows Svelte 5 to track changes
	const getData = typeof dataProp === "function" ? dataProp : () => dataProp;

	// ========================================
	// Reactive State using Svelte 5 runes
	// ========================================

	// Table state - use initialState if provided
	let sorting = $state<SortingState>(initialState?.sorting ?? []);
	let globalFilter = $state<GlobalFilterTableState | undefined>(initialState?.globalFilter);
	let pagination = $state<PaginationState>(initialState?.pagination ?? { pageIndex: 0, pageSize: 10 });
	let columnFilters = $state<ColumnFiltersState>(initialState?.columnFilters ?? []);
	let rowSelection = $state<RowSelectionState>(initialState?.rowSelection ?? {});
	let columnPinning = $state<ColumnPinningState>(initialState?.columnPinning ?? {});
	let columnVisibility = $state<VisibilityState>(initialState?.columnVisibility ?? {});
	let columnSizing = $state<ColumnSizingState>(initialState?.columnSizing ?? {});
	let columnSizingInfo = $state<ColumnSizingInfoState>({
		startOffset: null,
		startSize: null,
		deltaOffset: null,
		deltaPercentage: null,
		isResizingColumn: false,
		columnSizingStart: [],
	});

	// ========================================
	// Create TanStack Table
	// ========================================

	// Initialize column sizing state from column definitions (only if not provided in initialState)
	$effect.pre(() => {
		if (Object.keys(columnSizing).length === 0) {
			const sizing: Record<string, number> = {};
			for (const col of columns) {
				if (col.size) {
					sizing[col.id as string] = col.size;
				}
			}
			if (Object.keys(sizing).length > 0) {
				columnSizing = sizing;
			}
		}
	});

	// Row Selection
	if (dataGridProps.enableRowSelectionUI) {
		const rowSelectionColumn: ColumnDef<TData> = {
			id: "select",
			header: () => {
				subscribeToTable();
				return renderComponent(DataGridCheckbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected(),
					onCheckedChange: () => table.toggleAllPageRowsSelected(),
				});
			},
			cell: (r) => {
				subscribeToTable();
				return renderComponent(DataGridCheckbox, {
					checked: r.row.getIsSelected(),
					onCheckedChange: () => r.row.toggleSelected(),
				});
			},
			enableResizing: false,
			enableSorting: false,
			size: 0,
		};
		options.columns.unshift(rowSelectionColumn);
	}

	// Create the base table options
	const baseTableOptions: TableOptionsResolved<TData> = {
		data: getData(),
		columns,
		state: {
			sorting,
			pagination,
			columnFilters,
			rowSelection,
			columnPinning,
			columnVisibility,
			columnSizing,
			columnSizingInfo,
			globalFilter,
		},
		onColumnSizingChange: (updater) => {
			columnSizing = typeof updater === "function" ? updater(columnSizing) : updater;
		},
		onColumnSizingInfoChange: (updater) => {
			columnSizingInfo = typeof updater === "function" ? updater(columnSizingInfo) : updater;
		},
		onColumnPinningChange: (updater) => {
			columnPinning = typeof updater === "function" ? updater(columnPinning) : updater;
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
			// No version counter needed - visibilityKey is derived from columnVisibility
			// and will automatically update when visibility changes
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === "function" ? updater(sorting) : updater;
		},
		onPaginationChange: (updater) => {
			pagination = typeof updater === "function" ? updater(pagination) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
		},
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
		},
		onGlobalFilterChange: (updater) => {
			globalFilter = typeof updater === "function" ? updater(globalFilter) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: "auto",
		manualFiltering: dataGridProps.manualFiltering,
		manualPagination: (dataGridProps?.isPaginationEnabled ?? true) == false ? true : dataGridProps?.manualPagination,
		manualSorting: dataGridProps.manualSorting,
		columnResizeMode: "onChange",
		rowCount: dataGridProps.rowCount,
		enableColumnResizing: true,
		defaultColumn: {
			minSize: 0,
			maxSize: 1000,
			size: 150,
		},
		enableRowSelection: true,
		enableColumnFilters: true,
		enableFilters: true,
		enableGlobalFilter: true,
		renderFallbackValue: null,
		onStateChange: () => {},
		mergeOptions: (defaultOptions: TableOptions<TData>, newOptions: Partial<TableOptions<TData>>) => {
			return { ...defaultOptions, ...newOptions };
		},
	};

	const table = createTable(baseTableOptions);

	// Create a subscriber to notify effects when table data changes
	// This is the key to making TanStack Table reactive in Svelte 5
	// When data comes from async sources (like database queries), the table needs
	// to notify consuming components that data has changed so they can re-render
	let notifyTableUpdate: () => void;
	const subscribeToTable = createSubscriber((update) => {
		notifyTableUpdate = update;
		return () => {};
	});

	// This is the key to reactivity: update table options in $effect.pre
	// whenever any of the state values change
	$effect.pre(() => {
		// Read all reactive state to create dependencies
		const currentState = {
			sorting,
			pagination,
			columnFilters,
			rowSelection,
			columnPinning,
			columnVisibility,
			columnSizing,
			columnSizingInfo,
			globalFilter,
		};
		const currentData = getData();

		// Update table with current state
		table.setOptions((prev) => ({
			...prev,
			data: currentData,
			state: {
				...prev.state,
				...currentState,
			},
		}));

		// Notify any subscribers that table data has changed
		// This triggers re-runs of effects/derived that called subscribeToTable()
		notifyTableUpdate?.();
	});

	// ========================================
	// Return
	// ========================================

	// Create a reactive table wrapper that exposes state-dependent getters
	// This is key to making the table reactive in Svelte 5
	// We use subscribeToTable() to register effects as subscribers, so they
	// re-run when notifyTableUpdate() is called after data changes
	const reactiveTable = {
		// Expose all original table methods and properties
		...table,
		// Override methods that depend on state to create reactive dependencies
		getRowModel: () => {
			subscribeToTable();
			return table.getRowModel();
		},
		getHeaderGroups: () => {
			subscribeToTable();
			return table.getHeaderGroups();
		},
		getAllColumns: () => {
			subscribeToTable();
			return table.getAllColumns();
		},
		getVisibleLeafColumns: () => {
			subscribeToTable();
			return table.getVisibleLeafColumns();
		},
		getState: () => {
			subscribeToTable();
			return table.getState();
		},
		getPageCount: () => {
			subscribeToTable();
			return table.getPageCount();
		},
		getColumn: (columnId: string) => {
			subscribeToTable();
			return table.getColumn(columnId);
		},
		// Forward all other methods to the original table
		setColumnFilters: table.setColumnFilters.bind(table),
		setSorting: table.setSorting.bind(table),
		setPagination: table.setPagination.bind(table),
		setPageIndex: table.setPageIndex.bind(table),
		setPageSize: table.setPageSize.bind(table),
		setColumnPinning: table.setColumnPinning.bind(table),
		setColumnVisibility: table.setColumnVisibility.bind(table),
		setRowSelection: table.setRowSelection.bind(table),
		setColumnSizing: table.setColumnSizing.bind(table),
		setOptions: table.setOptions.bind(table),
		// setGlobalFilter: table.setGlobalFilter.bind(table),
		getFlatHeaders: () => {
			subscribeToTable();
			return table.getFlatHeaders();
		},
		getTotalSize: () => {
			subscribeToTable();
			return table.getTotalSize();
		},
		getLeftLeafColumns: () => {
			subscribeToTable();
			return table.getLeftLeafColumns();
		},
		getRightLeafColumns: () => {
			subscribeToTable();
			return table.getRightLeafColumns();
		},
		getCenterLeafColumns: () => {
			subscribeToTable();
			return table.getCenterLeafColumns();
		},
		getIsAllRowsSelected: () => {
			subscribeToTable();
			return table.getIsAllRowsSelected();
		},
		getIsSomeRowsSelected: () => {
			subscribeToTable();
			return table.getIsSomeRowsSelected();
		},
		getIsAllPageRowsSelected: () => {
			subscribeToTable();
			return table.getIsAllPageRowsSelected();
		},
		getIsSomePageRowsSelected: () => {
			subscribeToTable();
			return table.getIsSomePageRowsSelected();
		},
		getCanPreviousPage: () => {
			subscribeToTable();
			return table.getCanPreviousPage();
		},
		getCanNextPage: () => {
			subscribeToTable();
			return table.getCanNextPage();
		},
		getFilteredSelectedRowModel: () => {
			subscribeToTable();
			return table.getFilteredSelectedRowModel();
		},
		toggleAllRowsSelected: table.toggleAllRowsSelected.bind(table),
		toggleAllPageRowsSelected: table.toggleAllPageRowsSelected.bind(table),
		// Keep table reference for any other property access
		_getDefaultColumnDef: table._getDefaultColumnDef.bind(table),
		get options() {
			subscribeToTable();
			return table.options;
		},
		initialState: table.initialState,
	} as unknown as Table<TData>;

	return {
		table: reactiveTable,
		dataGridProps: dataGridProps,
	};
}
