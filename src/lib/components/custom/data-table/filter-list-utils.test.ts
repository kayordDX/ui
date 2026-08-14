import { describe, expect, it } from "vitest";
import { applyFilterOperator, getFilterOperators, isExtendedColumnFilter, isInactiveFilter } from "./filter-list-utils";

describe("getFilterOperators", () => {
	it("returns a non-empty operator list per variant", () => {
		for (const variant of ["text", "number", "date", "select", "multi-select"] as const) {
			const operators = getFilterOperators(variant);
			expect(operators.length).toBeGreaterThan(0);
			expect(operators[0].label).toBeTruthy();
		}
	});

	it("gives range operators to number and date variants only", () => {
		expect(getFilterOperators("number").map((o) => o.value)).toContain("inRange");
		expect(getFilterOperators("date").map((o) => o.value)).toContain("inRange");
		expect(getFilterOperators("text").map((o) => o.value)).not.toContain("inRange");
	});
});

describe("isExtendedColumnFilter", () => {
	it("detects filters carrying an operator", () => {
		expect(isExtendedColumnFilter({ id: "name", value: "a", operator: "contains" })).toBe(true);
		expect(isExtendedColumnFilter({ id: "name", value: "a" })).toBe(false);
	});
});

describe("isInactiveFilter", () => {
	it("treats empty values as inactive", () => {
		expect(isInactiveFilter({ id: "name", value: "", operator: "contains" })).toBe(true);
		expect(isInactiveFilter({ id: "tags", value: [], operator: "includesSome" })).toBe(true);
		expect(isInactiveFilter({ id: "id", value: [undefined, undefined], operator: "inRange" })).toBe(true);
	});

	it("keeps empty checks active", () => {
		expect(isInactiveFilter({ id: "name", value: "", operator: "isEmpty" })).toBe(false);
		expect(isInactiveFilter({ id: "name", value: "abc", operator: "contains" })).toBe(false);
	});
});

describe("applyFilterOperator", () => {
	it("handles text operators case-insensitively", () => {
		expect(applyFilterOperator("Alice", "contains", "ali")).toBe(true);
		expect(applyFilterOperator("Alice", "notContains", "ali")).toBe(false);
		expect(applyFilterOperator("Alice", "startsWith", "al")).toBe(true);
		expect(applyFilterOperator("Alice", "endsWith", "CE")).toBe(true);
		expect(applyFilterOperator("Alice", "equals", "alice")).toBe(true);
		expect(applyFilterOperator("Alice", "notEquals", "bob")).toBe(true);
	});

	it("handles numeric comparison operators", () => {
		expect(applyFilterOperator(5, "equals", "5")).toBe(true);
		expect(applyFilterOperator(5, "greaterThan", 4)).toBe(true);
		expect(applyFilterOperator(5, "greaterThanOrEqual", 5)).toBe(true);
		expect(applyFilterOperator(5, "lessThan", 4)).toBe(false);
		expect(applyFilterOperator(5, "lessThanOrEqual", 5)).toBe(true);
		expect(applyFilterOperator(5, "inRange", [3, 7])).toBe(true);
		expect(applyFilterOperator(5, "inRange", [undefined, 4])).toBe(false);
		expect(applyFilterOperator(5, "inRange", [6, undefined])).toBe(false);
		expect(applyFilterOperator(5, "inRange", [undefined, undefined])).toBe(true);
	});

	it("handles date operators with Date and ISO string values", () => {
		const rowDate = new Date("2025-06-15T10:00:00.000Z");
		expect(applyFilterOperator(rowDate, "equals", "2025-06-15T10:00:00.000Z")).toBe(true);
		expect(applyFilterOperator(rowDate, "before", "2025-07-01T00:00:00.000Z")).toBe(true);
		expect(applyFilterOperator(rowDate, "after", "2025-07-01T00:00:00.000Z")).toBe(false);
		expect(applyFilterOperator(rowDate, "inRange", ["2025-06-01T00:00:00.000Z", "2025-06-30T00:00:00.000Z"])).toBe(
			true
		);
	});

	it("handles empty operators", () => {
		expect(applyFilterOperator(null, "isEmpty", "")).toBe(true);
		expect(applyFilterOperator("", "isEmpty", "")).toBe(true);
		expect(applyFilterOperator([], "isEmpty", "")).toBe(true);
		expect(applyFilterOperator("x", "isEmpty", "")).toBe(false);
		expect(applyFilterOperator(null, "isNotEmpty", "")).toBe(false);
		expect(applyFilterOperator("x", "isNotEmpty", "")).toBe(true);
	});

	it("handles select and multi-select operators", () => {
		expect(applyFilterOperator("Mon", "equals", "mon")).toBe(true);
		expect(applyFilterOperator(["admin", "editor"], "includesSome", ["editor", "viewer"])).toBe(true);
		expect(applyFilterOperator(["admin", "editor"], "includesAll", ["editor", "viewer"])).toBe(false);
		expect(applyFilterOperator(["admin", "editor"], "includesAll", ["admin", "editor"])).toBe(true);
		expect(applyFilterOperator("admin", "includesSome", ["admin"])).toBe(true);
	});
});
