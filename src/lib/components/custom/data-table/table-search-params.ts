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
	return page.url.searchParams
		.get("sort")
		?.split(",")
		.map((s) => ({ id: s[0] === "-" ? s.slice(1) : s.slice(0), desc: s[0] === "-" }));
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
export const decodePageIndex = () => {
	return Number(page.url.searchParams.get("page") ?? "0");
};

export const encodeColumnFilters = (state: State) => {
	return encodeURIComponent(JSON.stringify(state.columnFilters ?? []));
};

export const decodeColumnFilters = () => {
	const raw = page.url.searchParams.get("filter");
	if (!raw) return [];

	// Current format: a single percent-encoded JSON array of filter entries.
	try {
		const parsed = JSON.parse(decodeURIComponent(raw));
		if (Array.isArray(parsed)) return parsed;
	} catch {
		// fall through to the legacy codec below
	}

	// Legacy format: comma-separated `id.<json value>` pairs. The value may
	// still be a full entry or a bare value; object values are wrapped rather
	// than spread so the entry shape is preserved.
	return raw
		.split(",")
		.map((v) => {
			const [id, stringValue] = v.split(".");
			if (!id) throw new Error("Invalid columnFilters");
			if (stringValue === undefined) throw new Error("Invalid columnFilters");
			const parsed = stringValue === "undefined" ? undefined : JSON.parse(decodeURIComponent(stringValue));
			const isEntry =
				parsed &&
				typeof parsed === "object" &&
				!Array.isArray(parsed) &&
				("filterId" in parsed || "joinOperator" in parsed || "operator" in parsed);
			const entry = isEntry ? parsed : { value: parsed };
			return {
				...entry,
				id,
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

export const decodeTableState = (): State => {
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
