import {
	tableFeatures,
	stockFeatures,
	metaHelper,
	createSortedRowModel,
	createFilteredRowModel,
	createPaginatedRowModel,
	createExpandedRowModel,
	createGroupedRowModel,
	createFacetedRowModel,
	createFacetedMinMaxValues,
	createFacetedUniqueValues,
	filterFns,
	sortFns,
	aggregationFns,
} from "@tanstack/svelte-table";
import type { CustomColumnMeta, CustomOptions } from "./types";

/** Feature set type used by {@link createShadTable}. */
export type DataTableFeatures = typeof features;

/**
 * The complete feature set used by {@link createShadTable}.
 *
 * v9 tree-shakes features, row models, and function registries. Registering
 * the full set here preserves the v8 "everything works out of the box"
 * behaviour so any string filter/sort/aggregation fn (including the default
 * `"auto"`) resolves instead of silently no-op'ing.
 *
 * The `columnMeta` / `tableMeta` slots type `columnDef.meta` and
 * `table.options.meta` per-table (e.g. `meta.className`, `meta.useURLSearchParams`)
 * without any global declaration merging.
 */
export const features = tableFeatures({
	...stockFeatures,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	expandedRowModel: createExpandedRowModel(),
	groupedRowModel: createGroupedRowModel(),
	facetedRowModel: createFacetedRowModel(),
	facetedMinMaxValues: createFacetedMinMaxValues(),
	facetedUniqueValues: createFacetedUniqueValues(),
	filterFns,
	sortFns,
	aggregationFns,
	columnMeta: metaHelper<CustomColumnMeta>(),
	tableMeta: metaHelper<CustomOptions>(),
});
