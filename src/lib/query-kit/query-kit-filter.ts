import QueryBuilder, {
	SortBuilder,
	parseSort,
	tryParseQuery,
	type ConditionExpr,
	type QueryExpr,
} from "querykit-builder";
import type { SortingState } from "@tanstack/svelte-table";
import {
	isInactiveFilter,
	type ExtendedColumnFilter,
	type FilterOperator,
	type JoinOperator,
} from "../components/custom/data-table/filter-list-utils";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}(T|$)/;

function isDateString(value: unknown): boolean {
	return typeof value === "string" && ISO_DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
}

function toExactValue(value: unknown): string | number | boolean {
	if (typeof value === "number" || typeof value === "boolean") return value;
	return String(value ?? "");
}

function stringValue(value: unknown): string {
	return String(value ?? "");
}

function isExactEquals(value: unknown): boolean {
	return typeof value === "number" || typeof value === "boolean" || isDateString(value);
}

const QUERY_OPERATOR: Record<string, string> = {
	contains: "@=*",
	notContains: "!@=*",
	startsWith: "_=*",
	doesNotStartWith: "!_=*",
	endsWith: "_-=*",
	doesNotEndWith: "!_-=*",
	equals: "==*",
	notEquals: "!=*",
	greaterThan: ">",
	greaterThanOrEqual: ">=",
	lessThan: "<",
	lessThanOrEqual: "<=",
	after: ">",
	before: "<",
	includesSome: "^$*",
	includesAll: "^$*",
	includesNone: "!^$*",
	isEmpty: "== null",
	isNotEmpty: "!= null",
};

interface FilterPart {
	text: string;
	multi: boolean;
	join: "&&" | "||";
}

function buildFilterPart(filter: ExtendedColumnFilter): string {
	const qb = new QueryBuilder();
	const id = filter.id;
	const value = filter.value;

	switch (filter.operator) {
		case "contains":
			qb.containsCaseInsensitive(id, stringValue(value));
			break;
		case "notContains":
			qb.doesNotContainCaseInsensitive(id, stringValue(value));
			break;
		case "startsWith":
			qb.startsWithCaseInsensitive(id, stringValue(value));
			break;
		case "doesNotStartWith":
			qb.doesNotStartWithCaseInsensitive(id, stringValue(value));
			break;
		case "endsWith":
			qb.endsWithCaseInsensitive(id, stringValue(value));
			break;
		case "doesNotEndWith":
			qb.doesNotEndWithCaseInsensitive(id, stringValue(value));
			break;
		case "equals":
			if (isExactEquals(value)) qb.equals(id, toExactValue(value));
			else qb.equalsCaseInsensitive(id, stringValue(value));
			break;
		case "notEquals":
			if (isExactEquals(value)) qb.notEquals(id, toExactValue(value));
			else qb.notEqualsCaseInsensitive(id, stringValue(value));
			break;
		case "greaterThan":
		case "after":
			qb.greaterThan(id, toExactValue(value));
			break;
		case "greaterThanOrEqual":
			qb.greaterThanOrEqual(id, toExactValue(value));
			break;
		case "lessThan":
		case "before":
			qb.lessThan(id, toExactValue(value));
			break;
		case "lessThanOrEqual":
			qb.lessThanOrEqual(id, toExactValue(value));
			break;
		case "inRange": {
			const [min, max] = Array.isArray(value) ? value : [undefined, undefined];
			if (min !== undefined && max !== undefined) {
				qb.greaterThanOrEqual(id, toExactValue(min)).and().lessThanOrEqual(id, toExactValue(max));
			} else if (min !== undefined) {
				qb.greaterThanOrEqual(id, toExactValue(min));
			} else if (max !== undefined) {
				qb.lessThanOrEqual(id, toExactValue(max));
			}
			break;
		}
		case "includesSome":
		case "includesAll":
		case "includesNone": {
			const values = Array.isArray(value) ? value : [];
			if (filter.operator === "includesNone") {
				if (values.length) qb.notInCaseInsensitive(id, values.map(stringValue));
			} else {
				values.forEach((v, i) => {
					if (i > 0) {
						if (filter.operator === "includesAll") qb.and();
						else qb.or();
					}
					qb.hasCaseInsensitive(id, stringValue(v));
				});
			}
			break;
		}
		case "isEmpty":
			qb.isNull(id);
			break;
		case "isNotEmpty":
			qb.isNotNull(id);
			break;
	}

	return qb.build();
}

export interface ToQueryKitFilterOptions {
	/** Fold the global search into the query as a case-insensitive property group, e.g. `(Name, Email) @=* "ali"`. */
	globalFilter?: string;
	/** Columns the global search matches against (required for `globalFilter` to be included). */
	globalFilterColumns?: string[];
}

/**
 * Serializes the table's extended column filters into a QueryKit filter string
 * (the input format of `ApplyQueryKitFilter` on the .NET side), e.g.
 * `Name @=* "ali" && Id > 5`.
 *
 * Inactive (empty) filters are skipped, mirroring the table's own evaluation.
 * String operators are emitted case-insensitively (`@=*`, `==*`, ...) because
 * the client-side evaluator is case-insensitive; numeric, boolean and date
 * values use the exact operators. `inRange` becomes a `>= && <=` pair and
 * multi-select values become `^$*` conditions joined with `&&`/`||` (`!^^*`
 * for `includesNone`) so semantics match between client and server.
 *
 * When {@link ToQueryKitFilterOptions.globalFilter} is provided it is
 * prepended as a property-group condition, which is QueryKit's idiomatic
 * "search anywhere" — it combines with the column filters using `&&`.
 *
 * The join order is preserved exactly as the table evaluates it: when the
 * filters mix `and`/`or`, the output is parenthesized left-to-right so a
 * server round-trip can never change meaning.
 */
export function toQueryKitFilter(filters: readonly ExtendedColumnFilter[], options?: ToQueryKitFilterOptions): string {
	const entries: FilterPart[] = [];
	const globalFilter = options?.globalFilter;
	const globalFilterColumns = options?.globalFilterColumns ?? [];
	if (globalFilter && globalFilterColumns.length) {
		entries.push({
			text: new QueryBuilder().containsCaseInsensitive(globalFilterColumns, globalFilter).build(),
			multi: false,
			join: "&&",
		});
	}
	for (const filter of filters) {
		if (isInactiveFilter(filter)) continue;
		const text = buildFilterPart(filter);
		if (!text) continue;
		entries.push({
			text,
			multi: text.includes("&&") || text.includes("||"),
			join: filter.joinOperator === "or" ? "||" : "&&",
		});
	}
	if (!entries.length) return "";

	const joins = entries.slice(1).map((entry) => entry.join);
	const allSame = joins.every((join) => join === joins[0]);

	if (allSame) {
		return entries.map((entry) => (entry.multi ? `(${entry.text})` : entry.text)).join(` ${joins[0]} `);
	}

	let out = entries[0].multi ? `(${entries[0].text})` : entries[0].text;
	for (let i = 1; i < entries.length; i++) {
		const part = entries[i].multi ? `(${entries[i].text})` : entries[i].text;
		out = `(${out} ${joins[i - 1]} ${part})`;
	}
	return out;
}

const FAMILY_JOIN: Partial<Record<FilterOperator, JoinOperator>> = {
	includesSome: "or",
	includesAll: "and",
	includesNone: "and",
};

/**
 * Serializes a table's sorting state into QueryKit's sort input
 * (the format of `ApplyQueryKitSort`), e.g. `Title, -Age`.
 */
export function toQueryKitSort(sorting: readonly SortingState[number][]): string {
	const builder = new SortBuilder();
	for (const sort of sorting) {
		if (sort.desc) builder.desc(sort.id);
		else builder.asc(sort.id);
	}
	return builder.build();
}

/** Parses a QueryKit sort string (Sieve or verbose syntax) into a sorting state. */
export function parseQueryKitSort(input: string): SortingState {
	if (!input?.trim()) return [];
	return parseSort(input).map(({ property, direction }) => ({ id: property, desc: direction === "desc" }));
}

function rhsValue(rhs: ConditionExpr["rhs"]): unknown {
	if (rhs.kind === "string") return rhs.value;
	if (rhs.kind === "number") return rhs.value;
	if (rhs.kind === "boolean") return rhs.value;
	if (rhs.kind === "datetime" || rhs.kind === "guid") return rhs.raw;
	if (rhs.kind === "array") return [...rhs.values];
	return "";
}

function conditionToChip(expr: ConditionExpr): ExtendedColumnFilter | null {
	if (expr.lhs.kind !== "property") {
		console.warn("[query-kit] arithmetic left-hand sides are not supported — filter skipped");
		return null;
	}
	const id = expr.lhs.path;
	const { operator } = expr;
	const rhs = expr.rhs;
	const isNull = rhs.kind === "null";

	switch (operator) {
		case "==":
			return isNull ? { id, value: "", operator: "isEmpty" } : { id, value: rhsValue(rhs), operator: "equals" };
		case "!=":
			return isNull ? { id, value: "", operator: "isNotEmpty" } : { id, value: rhsValue(rhs), operator: "notEquals" };
		case ">":
		case "<": {
			const value = rhsValue(rhs);
			return {
				id,
				value,
				operator: isDateString(value)
					? operator === ">"
						? "after"
						: "before"
					: operator === ">"
						? "greaterThan"
						: "lessThan",
			};
		}
		case ">=":
			return { id, value: rhsValue(rhs), operator: "greaterThanOrEqual" };
		case "<=":
			return { id, value: rhsValue(rhs), operator: "lessThanOrEqual" };
		case "@=":
		case "@=*":
			return { id, value: rhsValue(rhs), operator: "contains" };
		case "!@=":
		case "!@=*":
			return { id, value: rhsValue(rhs), operator: "notContains" };
		case "_=":
		case "_=*":
			return { id, value: rhsValue(rhs), operator: "startsWith" };
		case "!_=":
		case "!_=*":
			return { id, value: rhsValue(rhs), operator: "doesNotStartWith" };
		case "_-=":
		case "_-=*":
			return { id, value: rhsValue(rhs), operator: "endsWith" };
		case "!_-=":
		case "!_-=*":
			return { id, value: rhsValue(rhs), operator: "doesNotEndWith" };
		case "^$":
		case "^$*":
			return { id, value: [rhsValue(rhs)], operator: "includesSome" };
		case "!^$":
		case "!^$*":
			return { id, value: [rhsValue(rhs)], operator: "includesNone" };
		case "^^":
		case "^^*":
			return { id, value: rhsValue(rhs), operator: "includesSome" };
		case "!^^":
		case "!^^*":
			return { id, value: rhsValue(rhs), operator: "includesNone" };
		default:
			console.warn(`[query-kit] unsupported QueryKit operator "${operator}" — filter skipped`);
			return null;
	}
}

function mergeFamilyChips(chips: ExtendedColumnFilter[]): ExtendedColumnFilter[] {
	const result: ExtendedColumnFilter[] = [];
	for (const chip of chips) {
		const previous = result[result.length - 1];
		const familyJoin = chip.operator ? FAMILY_JOIN[chip.operator] : undefined;
		if (
			previous &&
			familyJoin &&
			previous.id === chip.id &&
			previous.operator === chip.operator &&
			chip.joinOperator === familyJoin
		) {
			previous.value = [
				...(Array.isArray(previous.value) ? previous.value : [previous.value]),
				...(Array.isArray(chip.value) ? chip.value : [chip.value]),
			];
			continue;
		}
		result.push(chip);
	}
	return result;
}

function collect(
	expr: QueryExpr | null,
	out: ExtendedColumnFilter[],
	nextJoin: JoinOperator,
	global: { value?: { columns: string[]; value: string } }
): void {
	if (!expr) return;
	if (expr.type === "condition") {
		if (expr.lhs.kind === "group") {
			if (!global.value) {
				global.value = { columns: expr.lhs.paths, value: String(rhsValue(expr.rhs) ?? "") };
			}
			return;
		}
		const chip = conditionToChip(expr);
		if (chip) out.push({ ...chip, filterId: crypto.randomUUID(), joinOperator: nextJoin });
		return;
	}
	collect(expr.left, out, nextJoin, global);
	collect(expr.right, out, expr.type, global);
}

export interface ParsedQueryKitFilter {
	filters: ExtendedColumnFilter[];
	/** Property-group condition (QueryKit's "search anywhere"), e.g. `(Name, Email) @=* "ali"`. */
	globalFilter?: { columns: string[]; value: string };
}

/**
 * Parses a QueryKit filter string back into the table's extended column
 * filters plus the global (property-group) search, so the filter list can be
 * hydrated from a URL, a saved view or a server response. The AST is walked in
 * printed order; nested groups collapse into a left-to-right list (the filter
 * list model is flat) and consecutive same-column has/in conditions merge back
 * into a single multi-select chip.
 *
 * Unsupported operators (sounds-like, count) and arithmetic left-hand sides
 * are skipped with a warning.
 */
export function parseQueryKitFilter(input: string): ParsedQueryKitFilter {
	if (!input?.trim()) return { filters: [] };

	const result = tryParseQuery(input);
	if (!result.ok) return { filters: [] };

	const chips: ExtendedColumnFilter[] = [];
	const global: { value?: { columns: string[]; value: string } } = {};
	collect(result.ast, chips, "and", global);
	return {
		filters: mergeFamilyChips(chips),
		...(global.value ? { globalFilter: global.value } : {}),
	};
}

/** @see {@link parseQueryKitFilter} — returns only the column filters. */
export function fromQueryKitFilter(input: string): ExtendedColumnFilter[] {
	return parseQueryKitFilter(input).filters;
}

export { QUERY_OPERATOR };
