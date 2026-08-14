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
import { renderComponent } from "$lib/components/ui/data-table";
import { features, type DataTableFeatures } from "./features";
import type { BaseOptions, CustomOptions } from "./types";

export type ShadTableOptions<TData extends RowData> = BaseOptions<TData> &
	CustomOptions & {
		/**
		 * When `true` (default) and `enableRowSelection` is on, {@link createShadTable}
		 * prepends a checkbox column. Not mirrored into `table.options.meta`.
		 */
		enableRowSelectionUI?: boolean;
	};

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
	const { useURLSearchParams, enablePaging = true, enableRowSelectionUI = true, ...rest } = shadOptions;

	// Row-model factories are included on demand. `enableSorting` /
	// `enableFilters` are native table options (default true); `enablePaging`
	// is the library's own flag (default true).
	const runtimeFeatures = {
		...features,
		...(rest.enableSorting !== false ? { sortedRowModel: createSortedRowModel() } : {}),
		...(rest.enableFilters !== false ? { filteredRowModel: createFilteredRowModel() } : {}),
		...(enablePaging ? { paginatedRowModel: createPaginatedRowModel() } : {}),
	};

	// Row-selection column. The header/cell closures reference `table` (assigned
	// below); that is safe because they only run during render, after `table`
	// exists. It has to be part of the initial options because v9's createTable
	// re-applies them in `$effect.pre` (a post-hoc setOptions would be reverted).
	const selectColumn: ColumnDef<DataTableFeatures, TData> = {
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
	};
	const table = createTable<DataTableFeatures, TData>({
		...rest,
		// Keep `data` reactive. Spreading `...rest` would snapshot a consumer
		// getter (`get data()`), so re-expose it as a getter that reads the
		// original options object each time v9 syncs options in `$effect.pre`.
		get data() {
			return shadOptions.data;
		},
		// Same idea for `columns` — re-read on each v9 option sync so a consumer
		// getter (`get columns()`) stays reactive. The selection column is
		// prepended on the fly when row selection + its UI are enabled.
		get columns() {
			const cols = shadOptions.columns ?? [];
			return rest.enableRowSelection && enableRowSelectionUI ? [selectColumn, ...cols] : cols;
		},
		// Server-side pagination: `rowCount` (the total row count) arrives from the
		// server and changes with each response, so re-read it like `data`/`columns`.
		get rowCount() {
			return shadOptions.rowCount;
		},
		features: runtimeFeatures,
		meta: { useURLSearchParams, enablePaging },
		...(useURLSearchParams ? { autoResetPageIndex: false } : {}),
	});

	return table;
}

export { features };
