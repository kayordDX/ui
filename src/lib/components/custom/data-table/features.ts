import { tableFeatures, stockFeatures, metaHelper, filterFns, sortFns, aggregationFns } from "@tanstack/svelte-table";
import type { CustomColumnMeta, CustomOptions } from "./types";

/** Feature set type used by {@link createShadTable}. */
export type DataTableFeatures = typeof features;

/**
 * The static feature set shared by every {@link createShadTable} table.
 *
 * This holds the **type-load-bearing** pieces only:
 * - all stock **feature modules** (so the `Table` / `ColumnDef` API surface and
 *   every `table.atoms.<slice>` is always available and consistently typed)
 * - the built-in **`filterFns` / `sortFns` / `aggregationFns` registries**, so
 *   any string fn (including the default `"auto"`) resolves instead of silently
 *   no-op'ing, and those strings typecheck in column defs
 * - the per-table **`columnMeta` / `tableMeta`** slots (`meta.className`,
 *   `meta.useURLSearchParams`)
 *
 * **Row-model factories are deliberately NOT included here.** They are
 * runtime-only (NonFeatureKeys): they do not affect the `Table` type at all, so
 * {@link createShadTable} adds them dynamically based on the relevant `enable*`
 * options — only wiring/bundling the row-processing pipelines that are needed,
 * like the v8 design did.
 */
export const features = tableFeatures({
	...stockFeatures,
	filterFns,
	sortFns,
	aggregationFns,
	columnMeta: metaHelper<CustomColumnMeta>(),
	tableMeta: metaHelper<CustomOptions>(),
});
