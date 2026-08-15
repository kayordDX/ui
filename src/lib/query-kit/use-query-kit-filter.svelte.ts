import { untrack } from "svelte";
import { useSearchParams } from "runed/kit";
import type { ColumnFiltersState, RowData, Table } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "../components/custom/data-table/features";
import { fromQueryKitFilter, parseQueryKitSort, toQueryKitFilter, toQueryKitSort } from "./query-kit-filter";
import z from "zod";

export interface UseQueryKitFilterOptions {
	/** URL search param the QueryKit filter string is read from / written to (default `filter`). */
	param?: string;
	/**
	 * Also sync the table's sorting to this param as a QueryKit sort string
	 * (e.g. `Title, -Age`). Pass `false` to disable (default `false`).
	 */
	sortParam?: string | false;
	/**
	 * Fold the table's global filter into the filter string as a
	 * case-insensitive property group across these columns (QueryKit's
	 * "search anywhere"). Omit to leave the global filter out.
	 */
	globalFilterColumns?: string[];
	/** Snap back to page 0 whenever the query changes (default `true`). */
	resetPageIndex?: boolean;
}

/**
 * Syncs a table's extended column filters (and optionally sorting / global
 * filter) with URL search params in QueryKit syntax (opt-in). The filter list
 * UI writes `columnFilters` state, this hook serializes it with
 * {@link toQueryKitFilter} so a server-side (`manualFiltering`) table can send
 * the strings straight to `ApplyQueryKitFilter` / `ApplyQueryKitSort`:
 *
 * ```ts
 * const table = createShadTable({ columns, data, manualFiltering: true });
 * useQueryKitFilter(table, {
 *   sortParam: "sort",
 *   globalFilterColumns: ["firstName", "lastName", "email"],
 * });
 * // ?filter=(firstName, lastName, email) @=* "ali" && Id > 5&sort=-JoinedAt
 * ```
 *
 * On init the table is hydrated from the params (`fromQueryKitFilter`,
 * `parseQueryKitSort`), so a shared URL round-trips through the filter list.
 * Don't combine with `useTableUrlSync`'s column-filter/sort sync on the same
 * params.
 */
export function useQueryKitFilter<TData extends RowData>(
	table: Table<DataTableFeatures, TData>,
	options?: UseQueryKitFilterOptions
) {
	const param = options?.param ?? "filter";
	const sortParam = options?.sortParam ?? false;
	const globalFilterColumns = options?.globalFilterColumns ?? [];
	const resetPageIndex = options?.resetPageIndex ?? true;

	let hasRun = false;

	const params = useSearchParams(
		z.object({
			[param]: z.string().default(""),
			...(sortParam ? { [sortParam]: z.string().default("") } : {}),
		}),
		{ pushHistory: false }
	) as Record<string, string>;

	const initialFilter = params[param];
	if (typeof initialFilter === "string" && initialFilter.trim()) {
		table.setColumnFilters(fromQueryKitFilter(initialFilter) as ColumnFiltersState);
	}
	if (sortParam) {
		const initialSort = params[sortParam];
		if (typeof initialSort === "string" && initialSort.trim()) {
			table.setSorting(parseQueryKitSort(initialSort));
		}
	}

	$effect(() => {
		const filters = table.atoms.columnFilters.get();
		const globalFilter = table.atoms.globalFilter.get();
		const sorting = sortParam ? table.atoms.sorting.get() : undefined;
		untrack(() => {
			params[param] = toQueryKitFilter(filters, {
				globalFilter: typeof globalFilter === "string" ? globalFilter : "",
				globalFilterColumns,
			});
			if (sortParam && sorting) params[sortParam] = toQueryKitSort(sorting);
			if (resetPageIndex && hasRun) table.setPageIndex(0);
			hasRun = true;
		});
	});
}
