import { createTable, type ColumnDef, type RowData, type Table, type Updater } from "@tanstack/svelte-table";
import DataTableCheckbox from "./DataTableCheckbox.svelte";
import { renderComponent } from "$lib/data-table";
import { features, type DataTableFeatures } from "./features";
import type { BaseOptions, CustomOptions } from "./types";

export type ShadTableOptions<TData extends RowData> = BaseOptions<TData> & CustomOptions;

/**
 * Creates a fully reactive TanStack Table v9 instance preconfigured for the
 * `<DataTable>` component.
 *
 * All row models (core, filtered, sorted, paginated, ...) and the built-in
 * filter/sort/aggregation function registries are registered via the shared
 * {@link features} object, so any string fn (including the default `"auto"`)
 * resolves out of the box. v9's `createTable` is atom-backed, so the returned
 * table updates the UI directly — no manual reactivity wrapper is needed.
 *
 * The custom flags (`useURLSearchParams`, `enablePaging`, ...) are exposed
 * through `table.options.meta` for the `<DataTable>` component to read.
 */
export function createShadTable<TData extends RowData>(
	shadOptions: ShadTableOptions<TData>
): Table<DataTableFeatures, TData> {
	const {
		useURLSearchParams,
		enablePaging = true,
		enableRowSelectionUI = true,
		enableVisibility,
		columns = [],
		...rest
	} = shadOptions;

	// `enableVisibility` is accepted for API compatibility but the column
	// visibility feature is always registered, so it is intentionally unused.
	void enableVisibility;

	// Prepend the row-selection column up front. v9's createTable re-applies
	// the options it receives in `$effect.pre`, so the selection column must be
	// part of the initial options (a post-hoc setOptions would be overwritten).
	// The header/cell closures reference `table` (assigned below); that is safe
	// because they only run during render, after `table` exists.
	const finalColumns: readonly ColumnDef<DataTableFeatures, TData>[] =
		rest.enableRowSelection && enableRowSelectionUI
			? [
					{
						id: "select",
						header: () =>
							renderComponent(DataTableCheckbox, {
								checked: table.getIsAllPageRowsSelected(),
								indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllRowsSelected(),
								onCheckedChange: () => table.toggleAllPageRowsSelected(),
							}),
						cell: (r) =>
							renderComponent(DataTableCheckbox, {
								checked: r.row.getIsSelected(),
								onCheckedChange: () => r.row.toggleSelected(),
							}),
						enableResizing: false,
						enableSorting: false,
					},
					...columns,
				]
			: columns;

	const table = createTable<DataTableFeatures, TData>({
		...rest,
		features,
		columns: finalColumns,
		meta: { useURLSearchParams, enablePaging },
		...(useURLSearchParams ? { autoResetPageIndex: false } : {}),
		...(enablePaging === false ? { manualPagination: true } : {}),
	});

	return table;
}

export { features };
export type { Updater };
