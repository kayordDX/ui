import { page } from "$app/state";
import type { TableState } from "@tanstack/table-core";
import { z } from "zod";

/*
  sort
  globalFilter
  page
  columnFilters
*/

export const defaultSearchParamSchema = z.object({
	sort: z
		.array(
			z.object({
				desc: z.boolean(),
				id: z.string(),
			})
		)
		.optional(),
	page: z
		.object({
			pageIndex: z.number(),
			pageSize: z.number(),
		})
		.optional(),
	globalFilter: z.any().optional(),
	columnFilters: z
		.array(
			z.object({
				id: z.string(),
				value: z.unknown(),
			})
		)
		.optional(),
});

// const what = useSearchParams(defaultSearchParamSchema);
export type SearchParamSchema = z.infer<typeof defaultSearchParamSchema>;

export const encodeSorting = (state: Partial<TableState>) => {
	return state.sorting?.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") ?? "";
};

export const decodeSorting = () => {
	return page.url.searchParams
		.get("sort")
		?.split(",")
		.map((s) => ({ id: s[0] === "-" ? s.slice(1) : s.slice(0), desc: s[0] === "-" }));
};

export const encodeGlobalFilter = (state: Partial<TableState>) => {
	return state.globalFilter;
};

export const decodeGlobalFilter = (): string | undefined => {
	const globalFilter = page.url.searchParams.get("globalFilter");
	return globalFilter != null ? globalFilter : undefined;
};

export const encodePageIndex = (state: Partial<TableState>) => {
	return state.pagination?.pageIndex?.toString() ?? "";
};
export const decodePageIndex = () => {
	return Number(page.url.searchParams.get("page") ?? "0");
};

export const encodeColumnFilters = (state: Partial<TableState>) => {
	return (
		state.columnFilters
			?.map(({ id, value }) => `${id}.${encodeURIComponent(JSON.stringify(value).replaceAll(".", "%2E"))}`)
			.join(",") ?? ""
	);
};

export const decodeColumnFilters = () => {
	return page.url.searchParams
		.get("columnFilters")
		?.split(",")
		.map((v) => {
			const [id, stringValue] = v.split(".");
			if (!id) throw new Error("Invalid columnFilters");
			if (stringValue === undefined) throw new Error("Invalid columnFilters");
			return {
				id,
				value: stringValue === "undefined" ? undefined : JSON.parse(decodeURIComponent(stringValue)),
			};
		})
		.filter((x) => x !== null);
};

interface Options {
	sorting?: boolean;
	globalFilter?: boolean;
	pagination?: boolean;
	columnFilter?: boolean;
}

export const decodeTableState = (): Partial<TableState> => {
	return {
		pagination: {
			pageIndex: decodePageIndex(),
			pageSize: 10,
		},
		sorting: decodeSorting(),
		columnFilters: decodeColumnFilters(),
		globalFilter: decodeGlobalFilter(),
	};
};

export const encodeTableState = (state: Partial<TableState>, options?: Options, searchParams?: URLSearchParams) => {
	if (searchParams === undefined) {
		searchParams = new URLSearchParams();
	}
	if (options === undefined) {
		options = {};
	}

	options.pagination = options.pagination ?? true;
	options.globalFilter = options.globalFilter ?? true;
	options.sorting = options.sorting ?? true;
	options.columnFilter = options.columnFilter ?? true;

	if (options.pagination && state.pagination?.pageIndex != 0) {
		searchParams.set("page", encodePageIndex(state));
	}
	if (options.globalFilter && state.globalFilter?.length > 0) {
		searchParams.set("globalFilter", encodeGlobalFilter(state));
	}
	if (options.sorting && (state.sorting?.length ?? 0) > 0) {
		searchParams.set("sort", encodeSorting(state));
	}
	if (options.columnFilter && (state.columnFilters?.length ?? 0) > 0) {
		searchParams.set("columnFilters", encodeColumnFilters(state));
	}
	return `?${searchParams.toString()}`;
};
