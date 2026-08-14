import { untrack } from "svelte";
import { beforeNavigate } from "$app/navigation";
import { useSearchParams } from "runed/kit";
import type { RowData, Table } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";
import { defaultSearchParamSchema } from "./types";
import {
	decodeColumnFilters,
	decodeGlobalFilter,
	decodePageIndex,
	decodeSorting,
	encodeColumnFilters,
	encodeSorting,
} from "./table-search-params";

/**
 * Which URL params to sync with the table. Omitted keys default to `true`, so
 * calling `useTableUrlSync(table)` syncs everything. Pass `false` to opt out
 * of individual params, or pass only the keys you want:
 *
 * ```ts
 * // sync only paging (`?page=2`)
 * useTableUrlSync(table, { pagination: true });
 * ```
 */
export interface TableUrlSyncOptions {
	/** Syncs the global filter to `?search=` (default `true`). */
	globalFilter?: boolean;
	/** Syncs sorting to `?sort=` (default `true`). */
	sorting?: boolean;
	/** Syncs column filters to `?filter=` (default `true`). */
	columnFilters?: boolean;
	/** Syncs the page index to `?page=` (default `true`). */
	pagination?: boolean;
}

/**
 * Keeps a table's global filter, sorting, column filters and page index in sync
 * with the URL search params (`search`, `sort`, `filter`, `page`).
 *
 * This is app-routing glue, not UI — call it explicitly from the component that
 * owns the table, next to `createShadTable`:
 *
 * ```svelte
 * const table = createShadTable({ ... });
 * useTableUrlSync(table);
 * ```
 *
 * The table is hydrated from the URL immediately, before the first render, so
 * row-model auto-resets (which are skipped on their first run) can't clobber
 * the URL-backed state.
 *
 * By default all four params are synced; pass {@link TableUrlSyncOptions} to
 * enable only a subset, e.g. `useTableUrlSync(table, { pagination: true })`.
 */
export function useTableUrlSync<TData extends RowData>(
	table: Table<DataTableFeatures, TData>,
	options?: TableUrlSyncOptions
) {
	const enabled = {
		globalFilter: true,
		sorting: true,
		columnFilters: true,
		pagination: true,
		...options,
	};

	const params = useSearchParams(defaultSearchParamSchema, { pushHistory: false });

	// Hydrate from the URL before the first render. Sorting/filter/data changes
	// defer an autoResetPageIndex microtask via the adapter's schedule; row
	// models skip auto-resets on their first run, so applying the URL state
	// up-front can't be undone by them (a post-mount hydration would be).
	if (enabled.globalFilter) table.setGlobalFilter(decodeGlobalFilter() ?? "");
	if (enabled.sorting) table.setSorting(decodeSorting() ?? []);
	if (enabled.pagination) table.setPageIndex(decodePageIndex());
	if (enabled.columnFilters) table.setColumnFilters(decodeColumnFilters() ?? []);

	// When navigating with new sort/search/filter params, snap back to page 1.
	beforeNavigate((navigation) => {
		if (enabled.pagination && Number(navigation.to?.url.searchParams.get("page") ?? "0") > 0) {
			const queryChanged =
				(enabled.sorting &&
					navigation.from?.url.searchParams.get("sort") != navigation.to?.url.searchParams.get("sort")) ||
				(enabled.globalFilter &&
					navigation.from?.url.searchParams.get("search") != navigation.to?.url.searchParams.get("search")) ||
				(enabled.columnFilters &&
					navigation.from?.url.searchParams.get("filter") != navigation.to?.url.searchParams.get("filter"));
			if (queryChanged) {
				table.resetPageIndex();
			}
		}
	});

	// Write atoms back to the URL. Only the enabled atoms are read (and thus
	// tracked) so the effect doesn't re-run on unrelated state (e.g. row
	// selection), and disabled params are left untouched in the URL.
	$effect(() => {
		const search = enabled.globalFilter ? table.atoms.globalFilter.get() : undefined;
		const page: number | undefined = enabled.pagination ? table.atoms.pagination.get().pageIndex : undefined;
		const sorting = enabled.sorting ? table.atoms.sorting.get() : undefined;
		const columnFilters = enabled.columnFilters ? table.atoms.columnFilters.get() : undefined;
		untrack(() => {
			if (enabled.globalFilter) params.search = search;
			if (enabled.pagination && page !== undefined) params.page = page;
			if (enabled.sorting) params.sort = encodeSorting({ sorting });
			if (enabled.columnFilters) params.filter = encodeColumnFilters({ columnFilters });
		});
	});
}
