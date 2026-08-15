// QueryKit integration (optional peer dependency `querykit-builder`).
//
// Opt-in: only import this subpath when you use QueryKit on the backend —
// the data-table core never touches this module.
export * from "querykit-builder";
export { fromQueryKitFilter, toQueryKitFilter, QUERY_OPERATOR } from "./query-kit-filter";
export { useQueryKitFilter, type UseQueryKitFilterOptions } from "./use-query-kit-filter.svelte";
