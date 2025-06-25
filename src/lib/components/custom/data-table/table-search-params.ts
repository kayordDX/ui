import { page } from "$app/state";
import type { TableState } from "@tanstack/table-core";

/*
  sort
  globalFilter
  page
  columnFilters
*/

export const encodeSorting = (state: TableState) => {
	return state.sorting?.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") ?? "";
};

export const decodeSorting = () => {
	return (
		page.url.searchParams
			.get("sort")
			?.split(",")
			.map((s) => ({ id: s[0] === "-" ? s.slice(1) : s.slice(0), desc: s[0] === "-" })) ?? []
	);
};

export const encodeGlobalFilter = (state: TableState) => {
	return state.globalFilter;
};

export const decodeGlobalFilter = () => {
	return page.url.searchParams.get("globalFilter") ?? "";
};

export const encodePageIndex = (state: TableState) => {
	return state.pagination?.pageIndex?.toString() ?? undefined;
};
export const decodePageIndex = () => {
	return Number(page.url.searchParams.get("page") ?? "0");
};

export const encodeColumnFilters = (state: TableState) => {
	return state.columnFilters
		?.map(({ id, value }) => `${id}.${encodeURIComponent(JSON.stringify(value).replaceAll(".", "%2E"))}`)
		.join(",");
};

export const decodeColumnFilters = () => {
	return (
		page.url.searchParams
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
			.filter((x) => x !== null) ?? []
	);
};

interface Options {
	sorting?: boolean;
	globalFilter?: boolean;
	pagination?: boolean;
	columnFilter?: boolean;
}

export const encodeTableState = (state: TableState, options?: Options, searchParams?: URLSearchParams) => {
	if (searchParams === undefined) {
		searchParams = new URLSearchParams();
	}
	if (options === undefined) {
		options = {};
	}

	options.sorting = options.sorting ?? true;
	options.globalFilter = options.globalFilter ?? true;
	options.pagination = options.pagination ?? true;
	options.columnFilter = options.columnFilter ?? true;

	if (options.globalFilter && state.globalFilter?.length > 0) {
		searchParams.set("globalFilter", encodeGlobalFilter(state));
	}
	if (options.pagination && state.pagination.pageIndex != 0) {
		searchParams.set("page", encodePageIndex(state));
	}
	if (options.sorting && state.sorting?.length > 0) {
		searchParams.set("sort", encodeSorting(state));
	}
	if (options.columnFilter && state.columnFilters?.length > 0) {
		searchParams.set("columnFilters", encodeColumnFilters(state));
	}
	return `?${searchParams.toString()}`;
};
