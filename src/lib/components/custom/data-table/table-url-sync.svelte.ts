import { page } from "$app/state";
import { beforeNavigate, goto } from "$app/navigation";
import { tick, untrack } from "svelte";
import { SvelteURLSearchParams } from "svelte/reactivity";
import type { RowData, Table } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";
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

type Enabled = Required<TableUrlSyncOptions>;

type Sorting = { id: string; desc: boolean }[];
type ColumnFilter = { id: string; value: unknown }[];

/** Serializes search params into a canonical string so URL ordering doesn't matter. */
const canonicalParams = (searchParams: URLSearchParams) =>
	[...searchParams.entries()]
		.map(([key, value]) => `${key}=${value}`)
		.sort()
		.join("&");

const sameSorting = (a: Sorting, b: Sorting) =>
	a.length === b.length && a.every((entry, index) => entry.id === b[index]?.id && entry.desc === b[index]?.desc);

const sameColumnFilters = (a: ColumnFilter, b: ColumnFilter) =>
	a.length === b.length &&
	a.every(
		(filter, index) => filter.id === b[index]?.id && JSON.stringify(filter.value) === JSON.stringify(b[index]?.value)
	);

/**
 * Copies the enabled params from `url` into the table, skipping values the
 * table already has so an unchanged URL never disturbs table state.
 *
 * Returns whether anything changed, and separately whether a sort/search/filter
 * param changed (a page-only change doesn't trigger the page-snap logic).
 */
function applyUrlToTable<TData extends RowData>(
	table: Table<DataTableFeatures, TData>,
	enabled: Enabled,
	url: URL
): { changed: boolean; queryChanged: boolean } {
	let changed = false;
	let queryChanged = false;

	if (enabled.globalFilter) {
		const next = decodeGlobalFilter(url) ?? "";
		if (next !== (table.atoms.globalFilter.get() ?? "")) {
			table.setGlobalFilter(next);
			changed = true;
			queryChanged = true;
		}
	}

	if (enabled.sorting) {
		const next = decodeSorting(url) ?? [];
		if (!sameSorting(next, table.atoms.sorting.get() ?? [])) {
			table.setSorting(next);
			changed = true;
			queryChanged = true;
		}
	}

	if (enabled.columnFilters) {
		const next = decodeColumnFilters(url) ?? [];
		if (!sameColumnFilters(next, table.atoms.columnFilters.get() ?? [])) {
			table.setColumnFilters(next);
			changed = true;
			queryChanged = true;
		}
	}

	if (enabled.pagination && url.searchParams.has("page")) {
		const next = decodePageIndex(url);
		if (next !== table.atoms.pagination.get().pageIndex) {
			table.setPageIndex(next);
			changed = true;
		}
	}

	return { changed, queryChanged };
}

/** Builds the query string that mirrors the table's enabled state, preserving unrelated params. */
function buildSearchParams(
	enabled: Enabled,
	search: string | undefined,
	pageIndex: number | undefined,
	sorting: Sorting | undefined,
	columnFilters: ColumnFilter | undefined
) {
	const params = new SvelteURLSearchParams(page.url.searchParams);

	if (enabled.globalFilter) {
		if (search) params.set("search", search);
		else params.delete("search");
	}
	if (enabled.pagination) {
		if (pageIndex && pageIndex > 0) params.set("page", String(pageIndex));
		else params.delete("page");
	}
	if (enabled.sorting) {
		if (sorting?.length) params.set("sort", encodeSorting({ sorting }));
		else params.delete("sort");
	}
	if (enabled.columnFilters) {
		if (columnFilters?.length) params.set("filter", encodeColumnFilters({ columnFilters }));
		else params.delete("filter");
	}

	return params;
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
 * The table is hydrated from the URL before the first render. After that, table
 * changes are mirrored to the URL, and URL changes from in-app navigations
 * (links, back/forward, address bar) are mirrored back into the table. Defaults
 * are omitted from the URL (`?page=0` never appears), and unrelated params are
 * left untouched.
 *
 * By default all four params are synced; pass {@link TableUrlSyncOptions} to
 * enable only a subset, e.g. `useTableUrlSync(table, { pagination: true })`.
 */
export function useTableUrlSync<TData extends RowData>(
	table: Table<DataTableFeatures, TData>,
	options?: TableUrlSyncOptions
) {
	const enabled: Enabled = {
		globalFilter: true,
		sorting: true,
		columnFilters: true,
		pagination: true,
		...options,
	};

	// Only mirror the URL while this table's page is active. Navigation away
	// destroys the component, and a late write-back must not fight the
	// in-flight navigation by navigating back.
	const selfPath = page.url.pathname;

	// Hydrate from the URL before the first render. Row models skip auto-resets
	// on their first run, so applying the URL state up-front can't be undone by
	// them (a post-mount hydration would be).
	applyUrlToTable(table, enabled, page.url);

	// Table → URL. Reads the enabled atoms (so this re-runs when they change),
	// then writes the URL once per flush and skips the write when nothing
	// actually changed. Navigations started here produce a URL identical to the
	// table state, so the handler below ignores them on arrival.
	$effect(() => {
		const search = enabled.globalFilter ? table.atoms.globalFilter.get() : undefined;
		const pageIndex = enabled.pagination ? table.atoms.pagination.get().pageIndex : undefined;
		const sorting = enabled.sorting ? table.atoms.sorting.get() : undefined;
		const columnFilters = enabled.columnFilters ? table.atoms.columnFilters.get() : undefined;

		untrack(() => {
			if (page.url.pathname !== selfPath) return;
			const params = buildSearchParams(enabled, search, pageIndex, sorting, columnFilters);
			if (canonicalParams(params) === canonicalParams(page.url.searchParams)) return;
			goto(`?${params}`, { replaceState: true, keepFocus: true });
		});
	});

	// URL → Table. Navigations we started ourselves already match the table
	// state, so they fall through applyUrlToTable without changes. Anything
	// else (links, back/forward, address bar) copies the target URL into the
	// table.
	beforeNavigate((navigation) => {
		const target = navigation.to?.url;
		if (!target || target.pathname !== selfPath) return;

		const { queryChanged } = applyUrlToTable(table, enabled, target);
		if (!queryChanged) return;

		// A new sort/search/filter makes the row models snap the page back to 0
		// on their next run. Wait for that render, then honor an explicit `page`
		// param so `?sort=-name&page=3` behaves like a fresh load of that URL.
		if (enabled.pagination && target.searchParams.has("page")) {
			void tick().then(() => {
				const targetPage = decodePageIndex(target);
				if (targetPage !== table.atoms.pagination.get().pageIndex) table.setPageIndex(targetPage);
			});
		}
	});
}
