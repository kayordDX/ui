import { createTable, type ColumnDef, type RowData, type Table } from "@tanstack/svelte-table";
import DataTableCheckbox from "./DataTableCheckbox.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import { features, type DataTableFeatures } from "./features";
import type { BaseOptions } from "./types";

export type ShadTableOptions<TData extends RowData> = BaseOptions<TData> & {
	/**
	 * When `true` (default) and `enableRowSelection` is on, {@link createShadTable}
	 * prepends a checkbox column.
	 */
	enableRowSelectionUI?: boolean;
};

/**
 * Creates a fully reactive TanStack Table v9 instance preconfigured for the
 * `<DataTable>` component.
 *
 * All features and row models come from the shared, static {@link features}
 * object. v9's `createTable` is atom-backed, so the returned table updates the
 * UI directly — no manual reactivity wrapper or `state`/`onXxxChange` plumbing
 * is needed. Use the `table.atoms.*` API to read/write state externally.
 */
export function createShadTable<TData extends RowData>(
	shadOptions: ShadTableOptions<TData>
): Table<DataTableFeatures, TData> {
	const { enableRowSelectionUI = true, ...rest } = shadOptions;

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
		features,
	});

	return table;
}

export { features };
