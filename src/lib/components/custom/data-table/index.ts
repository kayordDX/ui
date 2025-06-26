export { default as DataTable } from "./DataTable.svelte";
export { createShadTable } from "./shad-table.svelte";
export { max, min, sum, uniqueCount } from "./data-table-utils";
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
