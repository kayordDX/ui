import type { RowData, TableOptions } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";

/** Table options bound to the library's feature set. `features` is set internally. */
export type BaseOptions<TData extends RowData> = Omit<TableOptions<DataTableFeatures, TData>, "features">;

/** Per-column metadata exposed via `columnDef.meta` (typed through the feature set). */
export interface CustomColumnMeta {
	className?: string;
}

/** Table-level metadata exposed via `table.options.meta` (typed through the feature set). */
export interface CustomOptions {
	[key: string]: unknown;
}
