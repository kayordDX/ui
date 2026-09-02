import { page } from "$app/state";
import type { TableState } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";

type State = Partial<TableState<DataTableFeatures>>;

/*
  sort
  globalFilter
  page
  columnFilters
*/

export const encodeSorting = (state: State) => {
	return state.sorting?.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") ?? "";
};

export const decodeSorting = () => {
	const sort = page.url.searchParams.get("sort");
	if (!sort) return undefined;

	return sort
		.split(",")
		.filter(Boolean)
		.map((s) => ({ id: s[0] === "-" ? s.slice(1) : s, desc: s[0] === "-" }));
};

export const encodeGlobalFilter = (state: State) => {
	return state.globalFilter;
};

export const decodeGlobalFilter = (): string | undefined => {
	const globalFilter = page.url.searchParams.get("search");
	return globalFilter != null ? globalFilter : undefined;
};

export const encodePageIndex = (state: State) => {
	return state.pagination?.pageIndex?.toString() ?? "";
};
export const decodePageIndex = (): number | undefined => {
	const raw = page.url.searchParams.get("page");
	if (raw == null) return undefined;

	const pageIndex = Number(raw);
	return Number.isFinite(pageIndex) ? pageIndex : undefined;
};

export const encodeColumnFilters = (state: State) => {
	return (
		state.columnFilters
			?.map(({ id, value }) => `${id}.${encodeURIComponent(JSON.stringify(value).replaceAll(".", "%2E"))}`)
			.join(",") ?? ""
	);
};

export const decodeColumnFilters = () => {
	const filter = page.url.searchParams.get("filter");
	if (!filter) return undefined;

	return filter.split(",").flatMap((v) => {
		if (!v) return [];

		const separatorIndex = v.indexOf(".");
		if (separatorIndex === -1) return [];

		const id = v.slice(0, separatorIndex);
		const stringValue = v.slice(separatorIndex + 1);
		if (!id || !stringValue) return [];

		try {
			return [{ id, value: stringValue === "undefined" ? undefined : JSON.parse(decodeURIComponent(stringValue)) }];
		} catch {
			return [];
		}
	});
};

interface Options {
	sorting?: boolean;
	globalFilter?: boolean;
	pagination?: boolean;
	columnFilter?: boolean;
}

export const decodeTableState = (): State => {
	const pageIndex = decodePageIndex();
	const state: State = {
		sorting: decodeSorting(),
		columnFilters: decodeColumnFilters(),
		globalFilter: decodeGlobalFilter(),
	};
	if (pageIndex !== undefined) {
		state.pagination = { pageIndex, pageSize: 10 };
	}
	return state;
};

export const encodeTableState = (state: State, options?: Options, searchParams?: URLSearchParams) => {
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
		searchParams.set("search", encodeGlobalFilter(state));
	}
	if (options.sorting && (state.sorting?.length ?? 0) > 0) {
		searchParams.set("sort", encodeSorting(state));
	}
	if (options.columnFilter && (state.columnFilters?.length ?? 0) > 0) {
		searchParams.set("filter", encodeColumnFilters(state));
	}
	return `?${searchParams.toString()}`;
};
