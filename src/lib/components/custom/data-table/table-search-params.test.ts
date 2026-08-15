import { describe, expect, it, vi } from "vitest";
import { decodeColumnFilters, encodeColumnFilters } from "./table-search-params";

const urlHolder: { url: URL } = { url: new URL("http://localhost/") };

vi.mock("$app/state", () => ({
	page: {
		get url() {
			return urlHolder.url;
		},
	},
}));

describe("table-search-params column filter codec", () => {
	it("round-trips extended filters through a real URL (operator / join preserved)", () => {
		const filters = [
			{ id: "name", value: "ali", operator: "contains", filterId: "f1", joinOperator: "and" },
			{ id: "id", value: 3, operator: "greaterThan", filterId: "f2", joinOperator: "or" },
		];
		const encoded = encodeColumnFilters({ columnFilters: filters as never });
		urlHolder.url = new URL(`http://localhost/?filter=${encoded}`);
		expect(decodeColumnFilters()).toEqual(filters);
	});

	it("round-trips array values (commas inside JSON survive the URL)", () => {
		const filters = [
			{ id: "tags", value: ["admin", "editor"], operator: "includesSome", filterId: "f1", joinOperator: "and" },
		];
		const encoded = encodeColumnFilters({ columnFilters: filters as never });
		urlHolder.url = new URL(`http://localhost/?filter=${encoded}`);
		expect(decodeColumnFilters()).toEqual(filters);
	});

	it("returns [] when the param is absent", () => {
		urlHolder.url = new URL("http://localhost/");
		expect(decodeColumnFilters()).toEqual([]);
	});

	it("decodes legacy value-only filters (string values)", () => {
		const old = `name.${encodeURIComponent(JSON.stringify("ali"))}`;
		urlHolder.url = new URL(`http://localhost/?filter=${old}`);
		expect(decodeColumnFilters()).toEqual([{ id: "name", value: "ali" }]);
	});

	it("wraps legacy object values instead of spreading them as filter entries", () => {
		const old = `salary.${encodeURIComponent(JSON.stringify({ min: 1 }))}`;
		urlHolder.url = new URL(`http://localhost/?filter=${old}`);
		expect(decodeColumnFilters()).toEqual([{ id: "salary", value: { min: 1 } }]);
	});
});
