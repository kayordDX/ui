import {
	createTable,
	functionalUpdate,
	type ColumnDef,
	type RowData,
	type Table,
	type TableState,
} from "@tanstack/svelte-table";
import DataTableCheckbox from "./DataTableCheckbox.svelte";
import { renderComponent } from "$lib/components/ui/data-table";
import { features, type DataTableFeatures } from "./features";
import type { BaseOptions } from "./types";

/** External state slices that can be controlled via `controlledState`. */
export type ControlledState = Partial<TableState<DataTableFeatures>>;

export type ShadTableOptions<TData extends RowData> = BaseOptions<TData> & {
	/**
	 * When `true` (default) and `enableRowSelection` is on, {@link createShadTable}
	 * prepends a checkbox column.
	 */
	enableRowSelectionUI?: boolean;
	/**
	 * Controlled external state, e.g. a `$state` object owned by the consumer:
	 *
	 * ```svelte
	 * const tableState = $state({
	 *   sorting: [] as SortingState,
	 *   globalFilter: "",
	 *   pagination: { pageIndex: 0, pageSize: 10 } as PaginationState,
	 * });
	 *
	 * const table = createShadTable({
	 *   columns,
	 *   controlledState: tableState,
	 *   resetPageIndexOn: ["sorting", "globalFilter"],
	 * });
	 * ```
	 *
	 * For every provided slice, {@link createShadTable} wires the v9 `state`
	 * getters and `on*Change` handlers for you — no `state: { get x() {...} }`
	 * or `onXChange` boilerplate. Reads/writes go through the reactive object,
	 * so the table and the consumer stay in sync. This is the pattern to use
	 * with server-side data / TanStack Query, where the query key derives from
	 * the external state.
	 */
	controlledState?: ControlledState;
	/**
	 * When one of these controlled slices changes, `pagination.pageIndex` is
	 * reset to 0 (like TanStack's own examples). Only applies to slices present
	 * in `controlledState` and only when `pagination` is also controlled.
	 */
	resetPageIndexOn?: Array<keyof ControlledState>;
};

/**
 * Creates a fully reactive TanStack Table v9 instance preconfigured for the
 * `<DataTable>` component.
 *
 * By default the table is uncontrolled: v9 owns state internally and you read
 * it via `table.atoms.*`. Pass `controlledState` (a reactive `$state` object)
 * to lift slices into external state — useful for server-side data, where the
 * query derives from the state, or TanStack Query.
 */
export function createShadTable<TData extends RowData>(
	shadOptions: ShadTableOptions<TData>
): Table<DataTableFeatures, TData> {
	const { enableRowSelectionUI = true, controlledState, resetPageIndexOn = [], ...rest } = shadOptions;

	// Build v9 `state` getters + `on*Change` handlers from the controlled slices.
	// Getters are defined as accessors (not spread) so they survive into the
	// options and read through the reactive object — v9's option sync
	// ($effect.pre) tracks them and re-syncs when the consumer mutates state.
	const externalState: Record<string, unknown> = {};
	const externalHandlers: Record<string, (updater: unknown) => void> = {};
	if (controlledState) {
		for (const key of Object.keys(controlledState)) {
			Object.defineProperty(externalState, key, {
				enumerable: true,
				get: () => controlledState[key as keyof ControlledState],
			});
			const resetPage = resetPageIndexOn.includes(key as keyof ControlledState);
			externalHandlers[`on${key.charAt(0).toUpperCase()}${key.slice(1)}Change`] = (updater) => {
				const record = controlledState as Record<string, unknown>;
				record[key] = functionalUpdate(updater, record[key]);
				if (resetPage && controlledState.pagination) {
					controlledState.pagination = { ...controlledState.pagination, pageIndex: 0 };
				}
			};
		}
	}
	const state = { ...(rest.state ?? {}) };
	if (controlledState) {
		for (const key of Object.keys(controlledState)) {
			Object.defineProperty(state, key, {
				enumerable: true,
				get: () => controlledState[key as keyof ControlledState],
			});
		}
	}

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
		...(controlledState ? { state, ...externalHandlers } : {}),
		features,
	});

	return table;
}

export { features };
