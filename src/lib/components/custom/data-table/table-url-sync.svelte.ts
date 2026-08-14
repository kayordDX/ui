import { onMount, untrack } from "svelte";
import { beforeNavigate } from "$app/navigation";
import { useSearchParams } from "runed/kit";
import type { RowData, Table } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";
import { defaultSearchParamSchema } from "./types";
import { decodeColumnFilters, decodeSorting, encodeColumnFilters, encodeSorting } from "./table-search-params";

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
 */
export function useTableUrlSync<TData extends RowData>(table: Table<DataTableFeatures, TData>) {
	const params = useSearchParams(defaultSearchParamSchema, { pushHistory: false });

	// Hydrate table state from the current URL once on mount.
	onMount(() => {
		table.setGlobalFilter(params.search);
		table.setSorting(decodeSorting() ?? []);
		table.setPageIndex(params.page);
		table.setColumnFilters(decodeColumnFilters() ?? []);
	});

	// When navigating with new sort/search/filter params, snap back to page 1.
	beforeNavigate((navigation) => {
		if (Number(navigation.to?.url.searchParams.get("page") ?? "0") > 0) {
			if (
				navigation.from?.url.searchParams.get("sort") != navigation.to?.url.searchParams.get("sort") ||
				navigation.from?.url.searchParams.get("search") != navigation.to?.url.searchParams.get("search") ||
				navigation.from?.url.searchParams.get("filter") != navigation.to?.url.searchParams.get("filter")
			) {
				table.resetPageIndex();
			}
		}
	});

	// Write atoms back to the URL. Only the URL-feeding atoms are read so the
	// effect doesn't re-run on unrelated state (e.g. row selection).
	$effect(() => {
		const search = table.atoms.globalFilter.get();
		const page = table.atoms.pagination.get().pageIndex;
		const sorting = table.atoms.sorting.get();
		const columnFilters = table.atoms.columnFilters.get();
		untrack(() => {
			params.search = search;
			params.page = page;
			params.sort = encodeSorting({ sorting });
			params.filter = encodeColumnFilters({ columnFilters });
		});
	});
}
