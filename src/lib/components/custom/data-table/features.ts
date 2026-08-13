import {
	tableFeatures,
	stockFeatures,
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
 * Re-export this (and its `typeof`) so consumers can build typed column
 * helpers: `createColumnHelper<typeof features, TData>()`.
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
});
