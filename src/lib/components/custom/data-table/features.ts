import {
	tableFeatures,
	stockFeatures,
	metaHelper,
	filterFns,
	sortFns,
	aggregationFns,
	createColumnHelper,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	type RowData,
} from "@tanstack/svelte-table";
import type { CustomColumnMeta, CustomOptions } from "./types";

/** Feature set type used by {@link createShadTable}. */
export type DataTableFeatures = typeof features;

/**
 * The static feature set shared by every {@link createShadTable} table.
 *
 * Includes:
 * - all stock **feature modules** (so the `Table` / `ColumnDef` API surface and
 *   every `table.atoms.<slice>` is always available and consistently typed)
 * - the **row models** (sorted / filtered / paginated) — runtime-only, but
 *   cheap to wire unconditionally: an unused pipeline simply falls through to
 *   the previous stage (matching the TanStack examples)
 * - the built-in **`filterFns` / `sortFns` / `aggregationFns` registries**, so
 *   any string fn (including the default `"auto"`) resolves instead of silently
 *   no-op'ing, and those strings typecheck in column defs
 * - the per-table **`columnMeta` / `tableMeta`** slots (`meta.className`)
 */
export const features = tableFeatures({
	...stockFeatures,
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
	filteredRowModel: createFilteredRowModel(),
	filterFns,
	sortFns,
	aggregationFns,
	columnMeta: metaHelper<CustomColumnMeta>(),
	tableMeta: metaHelper<CustomOptions>(),
});

/**
 * Creates a `ColumnHelper` bound to the library's feature set, so consumers
 * get the same typed API as the TanStack examples:
 *
 * ```ts
 * const helper = createColumnHelper<Person>();
 * const columns = helper.columns([helper.accessor("name", { header: "Name" })]);
 * ```
 */
export const createColumnHelperFor = <TData extends RowData>() => createColumnHelper<DataTableFeatures, TData>();
