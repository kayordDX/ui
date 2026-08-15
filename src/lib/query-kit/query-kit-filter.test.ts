import { describe, expect, it } from "vitest";
import type { ExtendedColumnFilter } from "../components/custom/data-table/filter-list-utils";
import { fromQueryKitFilter, toQueryKitFilter } from "./query-kit-filter";

describe("toQueryKitFilter", () => {
	it("serializes a single text contains filter", () => {
		expect(toQueryKitFilter([{ id: "name", value: "ali", operator: "contains", joinOperator: "and" }])).toBe(
			'name @=* "ali"'
		);
	});

	it("serializes exact equals for numbers and dates, case-insensitive for text", () => {
		expect(toQueryKitFilter([{ id: "id", value: 5, operator: "equals" }])).toBe("id == 5");
		expect(toQueryKitFilter([{ id: "name", value: "alice", operator: "equals" }])).toBe('name ==* "alice"');
		expect(toQueryKitFilter([{ id: "joined", value: "2025-06-15T00:00:00.000Z", operator: "equals" }])).toBe(
			'joined == "2025-06-15T00:00:00.000Z"'
		);
	});

	it("serializes numeric comparisons", () => {
		expect(toQueryKitFilter([{ id: "id", value: 3, operator: "greaterThan" }])).toBe("id > 3");
		expect(toQueryKitFilter([{ id: "id", value: 5, operator: "lessThanOrEqual" }])).toBe("id <= 5");
		expect(toQueryKitFilter([{ id: "id", value: 5, operator: "after" }])).toBe("id > 5");
	});

	it("serializes inRange as a >= && <= pair", () => {
		expect(toQueryKitFilter([{ id: "id", value: [1, 5], operator: "inRange" }])).toBe("(id >= 1 && id <= 5)");
	});

	it("serializes empty checks as null conditions", () => {
		expect(toQueryKitFilter([{ id: "name", value: "", operator: "isEmpty" }])).toBe("name == null");
		expect(toQueryKitFilter([{ id: "name", value: "", operator: "isNotEmpty" }])).toBe("name != null");
	});

	it("serializes multi-select as has conditions joined by the operator", () => {
		expect(toQueryKitFilter([{ id: "tags", value: ["a", "b"], operator: "includesSome" }])).toBe(
			'(tags ^$* "a" || tags ^$* "b")'
		);
		expect(toQueryKitFilter([{ id: "tags", value: ["a", "b"], operator: "includesAll" }])).toBe(
			'(tags ^$* "a" && tags ^$* "b")'
		);
		expect(toQueryKitFilter([{ id: "tags", value: ["a", "b"], operator: "includesNone" }])).toBe('tags !^^* ["a","b"]');
	});

	it("joins filters with and by default", () => {
		expect(
			toQueryKitFilter([
				{ id: "day", value: "Mon", operator: "equals", joinOperator: "and" },
				{ id: "id", value: 3, operator: "greaterThan", joinOperator: "and" },
			])
		).toBe('day ==* "Mon" && id > 3');
	});

	it("parenthesizes left-to-right when joins mix", () => {
		expect(
			toQueryKitFilter([
				{ id: "a", value: 1, operator: "equals", joinOperator: "and" },
				{ id: "b", value: 2, operator: "equals", joinOperator: "or" },
				{ id: "c", value: 3, operator: "equals", joinOperator: "and" },
			])
		).toBe("((a == 1 || b == 2) && c == 3)");
	});

	it("skips inactive filters and returns an empty string for no filters", () => {
		expect(toQueryKitFilter([{ id: "name", value: "", operator: "equals" }])).toBe("");
		expect(toQueryKitFilter([])).toBe("");
	});
});

describe("fromQueryKitFilter", () => {
	it("parses a flat and-query into chips", () => {
		const chips = fromQueryKitFilter('FirstName == "Jane" && Age > 10');
		expect(chips).toHaveLength(2);
		expect(chips[0]).toMatchObject({ id: "FirstName", value: "Jane", operator: "equals", joinOperator: "and" });
		expect(chips[1]).toMatchObject({ id: "Age", value: 10, operator: "greaterThan", joinOperator: "and" });
	});

	it("keeps or joins between chips", () => {
		const chips = fromQueryKitFilter("A == 1 || B == 2");
		expect(chips[0].joinOperator).toBe("and");
		expect(chips[1].joinOperator).toBe("or");
	});

	it("maps dates to before/after", () => {
		const chips = fromQueryKitFilter('Joined > "2025-01-01T00:00:00.000Z"');
		expect(chips[0]).toMatchObject({ id: "Joined", value: "2025-01-01T00:00:00.000Z", operator: "after" });
	});

	it("parses null conditions as empty checks", () => {
		const chips = fromQueryKitFilter("DeletedAt == null && Name != null");
		expect(chips[0]).toMatchObject({ id: "DeletedAt", operator: "isEmpty" });
		expect(chips[1]).toMatchObject({ id: "Name", operator: "isNotEmpty" });
	});

	it("merges consecutive has conditions into one multi-select chip", () => {
		const chips = fromQueryKitFilter('Tags ^$* "a" || Tags ^$* "b"');
		expect(chips).toHaveLength(1);
		expect(chips[0]).toMatchObject({ id: "Tags", operator: "includesSome", value: ["a", "b"] });
	});

	it("parses in-arrays as includesNone", () => {
		const chips = fromQueryKitFilter('Status !^^* ["Closed"]');
		expect(chips[0]).toMatchObject({ id: "Status", operator: "includesNone", value: ["Closed"] });
	});

	it("skips unsupported operators and returns [] for empty or invalid input", () => {
		expect(fromQueryKitFilter('Title ~~ "doon"')).toEqual([]);
		expect(fromQueryKitFilter("")).toEqual([]);
		expect(fromQueryKitFilter("Age == ")).toEqual([]);
	});

	it("round-trips through toQueryKitFilter", () => {
		const filters: ExtendedColumnFilter[] = [
			{ id: "name", value: "ali", operator: "contains", filterId: "x", joinOperator: "and" },
			{ id: "id", value: 3, operator: "greaterThan", filterId: "y", joinOperator: "and" },
		];
		const roundTripped = fromQueryKitFilter(toQueryKitFilter(filters));
		expect(roundTripped).toHaveLength(2);
		expect(roundTripped[0]).toMatchObject({ id: "name", value: "ali", operator: "contains" });
		expect(roundTripped[1]).toMatchObject({ id: "id", value: 3, operator: "greaterThan" });
	});

	it("round-trips multi-select chips", () => {
		const filters: ExtendedColumnFilter[] = [
			{ id: "tags", value: ["a", "b"], operator: "includesSome", filterId: "x", joinOperator: "and" },
		];
		const roundTripped = fromQueryKitFilter(toQueryKitFilter(filters));
		expect(roundTripped).toHaveLength(1);
		expect(roundTripped[0]).toMatchObject({ id: "tags", operator: "includesSome", value: ["a", "b"] });
	});
});
