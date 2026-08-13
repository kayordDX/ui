import {
	createTable,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	type ColumnDef,
	type RowData,
	type Table,
} from "@tanstack/svelte-table";
import DataTableCheckbox from "./DataTableCheckbox.svelte";
import { renderComponent } from "$lib/data-table";
import { features, type DataTableFeatures } from "./features";
import type { BaseOptions, CustomOptions } from "./types";

export type ShadTableOptions<TData extends RowData> = BaseOptions<TData> & CustomOptions;

/**
 * Creates a fully reactive TanStack Table v9 instance preconfigured for the
 * `<DataTable>` component.
 *
 * The **feature modules + function registries** come from the shared, static
 * {@link features} object (so the type surface and string fn resolution stay
 * stable). The **row-model factories are added dynamically** based on the
 * relevant `enable*` options — matching the v8 design — so only the
 * row-processing pipelines that are actually needed are wired up. Row models
 * are runtime-only (NonFeatureKeys), so omitting them does not change the
 * `Table` type; the unused stage simply falls through to the previous one.
 *
 * v9's `createTable` is atom-backed, so the returned table updates the UI
 * directly — no manual reactivity wrapper is needed. The custom flags
 * (`useURLSearchParams`, `enablePaging`) are exposed via `table.options.meta`.
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

	// Row-model factories are included on demand. `enableSorting` /
	// `enableFilters` are native table options (default true); `enablePaging`
	// is the library's own flag (default true).
	const runtimeFeatures = {
		...features,
		...(rest.enableSorting !== false ? { sortedRowModel: createSortedRowModel() } : {}),
		...(rest.enableFilters !== false ? { filteredRowModel: createFilteredRowModel() } : {}),
		...(enablePaging ? { paginatedRowModel: createPaginatedRowModel() } : {}),
	};

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
		get data() {
			return shadOptions.data;
		},
		features: runtimeFeatures,
		columns: finalColumns,
		meta: { useURLSearchParams, enablePaging },
		...(useURLSearchParams ? { autoResetPageIndex: false } : {}),
	});

	return table;
}

export { features };
