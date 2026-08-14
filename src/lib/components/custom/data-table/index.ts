export { default as DataTable } from "./DataTable.svelte";
export { createShadTable, features } from "./shad-table.svelte";
export type { ShadTableOptions } from "./shad-table.svelte";
export type { DataTableFeatures } from "./features";
export { aggregationFns } from "./data-table-utils";
export {
	decodeColumnFilters,
	decodeGlobalFilter,
	decodePageIndex,
	decodeSorting,
	decodeTableState,
	encodeColumnFilters,
	encodeGlobalFilter,
	encodePageIndex,
	encodeSorting,
	encodeTableState,
} from "./table-search-params";
export type { CustomColumnMeta, CustomOptions } from "./types";
