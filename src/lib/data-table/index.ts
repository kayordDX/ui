// Re-export the official TanStack Svelte v9 adapter surface (createTable,
// FlexRender, renderComponent/renderSnippet, createTableState, and all types).
// Plus the library's extras: useTableUrlSync, createColumnHelperFor, etc.
export * from "../components/ui/data-table/index.js";

// The feature set (value + type) used by createShadTable. Consumers type
// columns/tables with the standard TanStack types, e.g.
// `ColumnDef<DataTableFeatures, TData>` / `Table<DataTableFeatures, TData>`.
export { features } from "../components/custom/data-table/features";
export type { DataTableFeatures } from "../components/custom/data-table/features";

export * from "../components/custom/data-table/index.js";

// Disambiguate the library's `aggregationFns` (sum/min/max/...) helper from
// the TanStack registry re-exported (as a type) by the adapter above.
export { aggregationFns } from "../components/custom/data-table/data-table-utils.js";
