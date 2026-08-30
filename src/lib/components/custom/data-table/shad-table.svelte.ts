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

export type ControlledState = Partial<TableState<DataTableFeatures>>;

export type ShadTableOptions<TData extends RowData> = BaseOptions<TData> & {
	enableRowSelectionUI?: boolean;
	controlledState?: ControlledState;
	resetPageIndexOn?: Array<keyof ControlledState> | undefined;
};

export function createShadTable<TData extends RowData>(
	shadOptions: ShadTableOptions<TData>
): Table<DataTableFeatures, TData> {
	const { enableRowSelectionUI = true, controlledState, resetPageIndexOn, ...rest } = shadOptions;

	const externalHandlers: Record<string, (updater: unknown) => void> = {};

	if (controlledState) {
		// Default: reset the page index on any controlled state change.
		const resetKeys = resetPageIndexOn ?? Object.keys(controlledState);
		for (const key of Object.keys(controlledState)) {
			const resetPage = resetKeys.includes(key as keyof ControlledState);
			externalHandlers[`on${key.charAt(0).toUpperCase()}${key.slice(1)}Change`] = (updater) => {
				const record = controlledState as Record<string, unknown>;
				record[key] = functionalUpdate(updater, record[key]);
				// Never reset the page because the page itself changed.
				if (resetPage && key !== "pagination" && controlledState.pagination) {
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
		get data() {
			return shadOptions.data;
		},
		get columns() {
			const cols = shadOptions.columns ?? [];
			return rest.enableRowSelection && enableRowSelectionUI ? [selectColumn, ...cols] : cols;
		},
		get rowCount() {
			return shadOptions.rowCount;
		},
		...(controlledState ? { state, ...externalHandlers } : {}),
		features,
	});

	return table;
}

export { features };
