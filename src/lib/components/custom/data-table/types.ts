import type { RowData, TableOptions } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";
import z from "zod";

/** Table options bound to the library's feature set. `features` is set internally. */
export type BaseOptions<TData extends RowData> = Omit<TableOptions<DataTableFeatures, TData>, "features">;

/** Per-column metadata exposed via `columnDef.meta` (typed through the feature set). */
export interface CustomColumnMeta {
	className?: string;
}

/** Flags passed to {@link createShadTable} and exposed via `table.options.meta`. */
export interface CustomOptions {
	useURLSearchParams?: boolean;
	enablePaging?: boolean;
	enableRowSelectionUI?: boolean;
}

export const defaultSearchParamSchema = z.object({
	search: z.any().default(""),
	page: z.coerce.number().default(0),
	filter: z.string().default(""),
	sort: z.string().default(""),
});

export type SearchParamSchema = z.infer<typeof defaultSearchParamSchema>;
