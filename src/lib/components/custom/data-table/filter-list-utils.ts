import type { ColumnFilter } from "@tanstack/svelte-table";

export type JoinOperator = "and" | "or";

export type FilterOperator =
	| "contains"
	| "notContains"
	| "startsWith"
	| "doesNotStartWith"
	| "endsWith"
	| "doesNotEndWith"
	| "equals"
	| "notEquals"
	| "greaterThan"
	| "greaterThanOrEqual"
	| "lessThan"
	| "lessThanOrEqual"
	| "inRange"
	| "before"
	| "after"
	| "includesSome"
	| "includesAll"
	| "includesNone"
	| "isEmpty"
	| "isNotEmpty";

export type FilterVariant = "text" | "number" | "date" | "select" | "multi-select";

export interface FilterOperatorOption {
	value: FilterOperator;
	label: string;
}

export interface ExtendedColumnFilter {
	id: string;
	value?: unknown;
	operator?: FilterOperator;
	filterId?: string;
	joinOperator?: JoinOperator;
}

const textOperators: FilterOperatorOption[] = [
	{ value: "contains", label: "contains" },
	{ value: "notContains", label: "does not contain" },
	{ value: "startsWith", label: "starts with" },
	{ value: "doesNotStartWith", label: "does not start with" },
	{ value: "endsWith", label: "ends with" },
	{ value: "doesNotEndWith", label: "does not end with" },
	{ value: "equals", label: "equals" },
	{ value: "notEquals", label: "not equals" },
	{ value: "isEmpty", label: "is empty" },
	{ value: "isNotEmpty", label: "is not empty" },
];

const numberOperators: FilterOperatorOption[] = [
	{ value: "equals", label: "equals" },
	{ value: "notEquals", label: "not equals" },
	{ value: "greaterThan", label: "greater than" },
	{ value: "greaterThanOrEqual", label: "greater or equal" },
	{ value: "lessThan", label: "less than" },
	{ value: "lessThanOrEqual", label: "less or equal" },
	{ value: "inRange", label: "in range" },
	{ value: "isEmpty", label: "is empty" },
	{ value: "isNotEmpty", label: "is not empty" },
];

const dateOperators: FilterOperatorOption[] = [
	{ value: "equals", label: "equals" },
	{ value: "notEquals", label: "not equals" },
	{ value: "before", label: "before" },
	{ value: "after", label: "after" },
	{ value: "inRange", label: "in range" },
	{ value: "isEmpty", label: "is empty" },
	{ value: "isNotEmpty", label: "is not empty" },
];

const selectOperators: FilterOperatorOption[] = [
	{ value: "equals", label: "equals" },
	{ value: "notEquals", label: "not equals" },
	{ value: "isEmpty", label: "is empty" },
	{ value: "isNotEmpty", label: "is not empty" },
];

const multiSelectOperators: FilterOperatorOption[] = [
	{ value: "includesSome", label: "includes any" },
	{ value: "includesAll", label: "includes all" },
	{ value: "includesNone", label: "includes none" },
	{ value: "isEmpty", label: "is empty" },
	{ value: "isNotEmpty", label: "is not empty" },
];

export function getFilterOperators(variant: FilterVariant): FilterOperatorOption[] {
	switch (variant) {
		case "number":
			return numberOperators;
		case "date":
			return dateOperators;
		case "select":
			return selectOperators;
		case "multi-select":
			return multiSelectOperators;
		default:
			return textOperators;
	}
}

export function isExtendedColumnFilter(filter: ColumnFilter | ExtendedColumnFilter): filter is ExtendedColumnFilter {
	return (
		typeof filter === "object" &&
		filter !== null &&
		"operator" in filter &&
		typeof (filter as ExtendedColumnFilter).operator === "string"
	);
}

export function isInactiveFilter(filter: ExtendedColumnFilter): boolean {
	if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") return false;
	const value = filter.value;
	if (value === undefined || value === null || value === "") return true;
	if (Array.isArray(value)) {
		if (value.length === 0) return true;
		return value.every((v) => v === undefined || v === null || v === "");
	}
	return false;
}

function isEmptyValue(value: unknown): boolean {
	return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function toNumber(value: unknown): number | undefined {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : undefined;
}

function isDateLike(value: unknown): boolean {
	return (
		value instanceof Date ||
		(typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(Date.parse(value)))
	);
}

function toTime(value: unknown): number | undefined {
	if (value instanceof Date) return value.getTime();
	if (typeof value === "string") {
		const t = Date.parse(value);
		return Number.isNaN(t) ? undefined : t;
	}
	return undefined;
}

function stringEquals(a: unknown, b: unknown): boolean {
	return String(a ?? "").toLowerCase() === String(b ?? "").toLowerCase();
}

function stringContains(value: unknown, search: unknown): boolean {
	return String(value ?? "")
		.toLowerCase()
		.includes(String(search ?? "").toLowerCase());
}

export function applyFilterOperator(rowValue: unknown, operator: FilterOperator, filterValue: unknown): boolean {
	switch (operator) {
		case "isEmpty":
			return isEmptyValue(rowValue);
		case "isNotEmpty":
			return !isEmptyValue(rowValue);
		case "contains":
			return stringContains(rowValue, filterValue);
		case "notContains":
			return !stringContains(rowValue, filterValue);
		case "startsWith":
			return String(rowValue ?? "")
				.toLowerCase()
				.startsWith(String(filterValue ?? "").toLowerCase());
		case "doesNotStartWith":
			return !String(rowValue ?? "")
				.toLowerCase()
				.startsWith(String(filterValue ?? "").toLowerCase());
		case "endsWith":
			return String(rowValue ?? "")
				.toLowerCase()
				.endsWith(String(filterValue ?? "").toLowerCase());
		case "doesNotEndWith":
			return !String(rowValue ?? "")
				.toLowerCase()
				.endsWith(String(filterValue ?? "").toLowerCase());
		case "equals": {
			if (isDateLike(rowValue) && isDateLike(filterValue)) {
				return toTime(rowValue) === toTime(filterValue);
			}
			const a = toNumber(rowValue);
			const b = toNumber(filterValue);
			if (a !== undefined && b !== undefined) return a === b;
			return stringEquals(rowValue, filterValue);
		}
		case "notEquals":
			return !applyFilterOperator(rowValue, "equals", filterValue);
		case "greaterThan":
		case "after": {
			if (isDateLike(rowValue) && isDateLike(filterValue)) {
				return (toTime(rowValue) ?? NaN) > (toTime(filterValue) ?? NaN);
			}
			const a = toNumber(rowValue);
			const b = toNumber(filterValue);
			return a !== undefined && b !== undefined ? a > b : false;
		}
		case "greaterThanOrEqual": {
			const a = toNumber(rowValue);
			const b = toNumber(filterValue);
			return a !== undefined && b !== undefined ? a >= b : false;
		}
		case "lessThan":
		case "before": {
			if (isDateLike(rowValue) && isDateLike(filterValue)) {
				return (toTime(rowValue) ?? NaN) < (toTime(filterValue) ?? NaN);
			}
			const a = toNumber(rowValue);
			const b = toNumber(filterValue);
			return a !== undefined && b !== undefined ? a < b : false;
		}
		case "lessThanOrEqual": {
			const a = toNumber(rowValue);
			const b = toNumber(filterValue);
			return a !== undefined && b !== undefined ? a <= b : false;
		}
		case "inRange": {
			const range = Array.isArray(filterValue) ? filterValue : [filterValue, undefined];
			if (isDateLike(rowValue)) {
				const t = toTime(rowValue) ?? NaN;
				const min = toTime(range[0]);
				const max = toTime(range[1]);
				return (min === undefined || t >= min) && (max === undefined || t <= max);
			}
			const t = toNumber(rowValue);
			const min = toNumber(range[0]);
			const max = toNumber(range[1]);
			return t !== undefined && (min === undefined || t >= min) && (max === undefined || t <= max);
		}
		case "includesSome":
		case "includesAll":
		case "includesNone": {
			const selected = Array.isArray(filterValue) ? filterValue : [filterValue];
			const includes = (v: unknown) =>
				Array.isArray(rowValue) ? rowValue.some((item) => stringEquals(item, v)) : stringEquals(rowValue, v);
			if (operator === "includesSome") return selected.some(includes);
			if (operator === "includesAll") return selected.every(includes);
			return !selected.some(includes);
		}
		default:
			return true;
	}
}
