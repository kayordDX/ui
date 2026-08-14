import type { RowData, TableOptions } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";
import type { FilterVariant } from "./filter-list-utils";
import z from "zod";

/** Table options bound to the library's feature set. `features` is set internally. */
export type BaseOptions<TData extends RowData> = Omit<TableOptions<DataTableFeatures, TData>, "features">;

/** Option shown by `DataTableFilterList` for `select` / `multi-select` columns. */
export interface FilterColumnOption {
	label: string;
	value: string;
	count?: number;
}

/** Per-column metadata exposed via `columnDef.meta` (typed through the feature set). */
export interface CustomColumnMeta {
	className?: string;
	/** Human readable column label (defaults to the column id). */
	label?: string;
	/** Forces the filter input variant instead of inferring it from the row values. */
	variant?: FilterVariant;
	/** Fixed options for `select` / `multi-select` filters (defaults to faceted values). */
	options?: FilterColumnOption[];
}

/** Table-level metadata exposed via `table.options.meta` (typed through the feature set). */
export interface CustomOptions {
	[key: string]: unknown;
}

export const defaultSearchParamSchema = z.object({
	search: z.any().default(""),
	page: z.coerce.number().default(0),
	filter: z.string().default(""),
	sort: z.string().default(""),
});

export type SearchParamSchema = z.infer<typeof defaultSearchParamSchema>;
