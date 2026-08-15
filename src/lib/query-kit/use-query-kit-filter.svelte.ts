import { untrack } from "svelte";
import { useSearchParams } from "runed/kit";
import type { ColumnFiltersState, RowData, Table } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "../components/custom/data-table/features";
import { fromQueryKitFilter, toQueryKitFilter } from "./query-kit-filter";
import z from "zod";

export interface UseQueryKitFilterOptions {
	/** URL search param the QueryKit filter string is read from / written to (default `filter`). */
	param?: string;
	/** Snap back to page 0 whenever the filter query changes (default `true`). */
	resetPageIndex?: boolean;
}

/**
 * Syncs a table's extended column filters with a URL search param in QueryKit
 * syntax (opt-in). The filter list UI writes `columnFilters` state, this hook
 * serializes it with {@link toQueryKitFilter} so a server-side
 * (`manualFiltering`) table can send the string straight to
 * `ApplyQueryKitFilter`:
 *
 * ```ts
 * const table = createShadTable({ columns, data, manualFiltering: true });
 * useQueryKitFilter(table);
 * ```
 *
 * On init the table is hydrated from the param (`fromQueryKitFilter`), so a
 * shared URL round-trips through the filter list. Don't combine with
 * `useTableUrlSync`'s column-filter sync on the same param.
 */
export function useQueryKitFilter<TData extends RowData>(
	table: Table<DataTableFeatures, TData>,
	options?: UseQueryKitFilterOptions
) {
	const param = options?.param ?? "filter";
	const resetPageIndex = options?.resetPageIndex ?? true;
	const params = useSearchParams(z.object({ [param]: z.string().default("") }), { pushHistory: false }) as Record<
		string,
		string
	>;

	const initial = params[param];
	if (typeof initial === "string" && initial.trim()) {
		table.setColumnFilters(fromQueryKitFilter(initial) as ColumnFiltersState);
	}

	$effect(() => {
		const filters = table.atoms.columnFilters.get();
		untrack(() => {
			params[param] = toQueryKitFilter(filters);
			if (resetPageIndex) table.setPageIndex(0);
		});
	});
}
