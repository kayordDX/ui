import type { RowData, TableOptions } from "@tanstack/svelte-table";
import type { features } from "./features";
import z from "zod";

/** Feature set type used by {@link createShadTable}. */
export type DataTableFeatures = typeof features;

/** Table options bound to the library's feature set. `features` is set internally. */
export type BaseOptions<TData extends RowData> = Omit<TableOptions<DataTableFeatures, TData>, "features">;

export interface CustomOptions {
	useURLSearchParams?: boolean;
	enablePaging?: boolean;
	enableRowSelectionUI?: boolean;
	enableVisibility?: boolean;
}

export interface CustomColumnMeta {
	className?: string;
}

export const defaultSearchParamSchema = z.object({
	search: z.any().default(""),
	page: z.coerce.number().default(0),
	filter: z.string().default(""),
	sort: z.string().default(""),
});

export type SearchParamSchema = z.infer<typeof defaultSearchParamSchema>;

declare module "@tanstack/table-core" {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
	interface ColumnMeta<TFeatures, TData, TValue> extends CustomColumnMeta {}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
	interface TableMeta<TFeatures, TData> extends CustomOptions {}
}
