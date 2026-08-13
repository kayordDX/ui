// Re-export the official TanStack Svelte v9 adapter surface (createTable,
// FlexRender, renderComponent/renderSnippet, createTableState, and all types).
export * from "../components/ui/data-table/index.js";

// Convenience aliases bound to the library's feature set, so consumers don't
// have to thread `typeof features` through every generic.
export { features } from "../components/custom/data-table/features";
export type { DataTableFeatures } from "../components/custom/data-table/features";
export type { ShadColumnDef, ShadTable, ShadUpdater } from "../components/custom/data-table/types-aliases.js";

export * from "../components/custom/data-table/index.js";

// Disambiguate the library's `aggregationFns` (sum/min/max/...) from the
// TanStack registry re-exported by the adapter above.
export { aggregationFns } from "../components/custom/data-table/data-table-utils.js";
