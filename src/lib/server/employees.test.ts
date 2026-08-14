import { describe, expect, it } from "vitest";
import { DATASET, queryEmployees, type Employee } from "./employees";

const SEARCH_FIELDS = (e: Employee) => [e.firstName, e.lastName, e.email, e.department, e.role, e.status];

describe("employees endpoint", () => {
	it("paginates the dataset", () => {
		const page0 = queryEmployees({ page: 0, size: 10 });
		const page1 = queryEmployees({ page: 1, size: 10 });

		expect(page0.total).toBe(DATASET.length);
		expect(page0.data).toHaveLength(10);
		expect(page1.data).toHaveLength(10);
		expect(page0.data[0].id).toBe(DATASET[0].id);
		expect(page1.data[0].id).toBe(DATASET[10].id);
	});

	it("returns the remaining rows on the last page", () => {
		// 137 rows / 10 per page => last page has 7 rows
		const last = queryEmployees({ page: 13, size: 10 });
		expect(last.data).toHaveLength(7);
		expect(last.total).toBe(137);
	});

	it("narrows rows by global search across fields (case-insensitive)", () => {
		const needle = "Engineering";
		const expected = DATASET.filter((e) =>
			SEARCH_FIELDS(e).some((f) => f.toLowerCase().includes(needle.toLowerCase()))
		);

		expect(queryEmployees({ q: needle, size: 200 }).total).toBe(expected.length);
		expect(queryEmployees({ q: needle.toUpperCase(), size: 200 }).total).toBe(expected.length);
	});

	it("applies a column filter (contains, on an unambiguous column)", () => {
		// "Sales" is not a substring of any other department
		const res = queryEmployees({ filters: [{ id: "department", value: "Sales" }], size: 200 });
		const expected = DATASET.filter((e) => e.department === "Sales");

		expect(res.total).toBe(expected.length);
		expect(res.data.every((e) => e.department === "Sales")).toBe(true);
	});

	it("combines global search and column filter (AND)", () => {
		const q = "a";
		const res = queryEmployees({ q, filters: [{ id: "department", value: "Sales" }], size: 500 });
		const expected = DATASET.filter(
			(e) => e.department === "Sales" && SEARCH_FIELDS(e).some((f) => f.toLowerCase().includes(q))
		);

		expect(res.total).toBe(expected.length);
		expect(res.data.every((e) => e.department === "Sales")).toBe(true);
	});

	it("sorts ascending and descending", () => {
		const asc = queryEmployees({ sort: "salary", size: 200 }).data;
		const desc = queryEmployees({ sort: "-salary", size: 200 }).data;

		const ascSalaries = asc.map((r) => r.salary);
		const descSalaries = desc.map((r) => r.salary);
		expect(ascSalaries).toEqual([...ascSalaries].sort((a, b) => a - b));
		expect(descSalaries).toEqual([...descSalaries].sort((a, b) => b - a));
		expect(asc[0].id).not.toBe(desc[0].id);
	});

	it("keeps filters while paginating", () => {
		const a = queryEmployees({ filters: [{ id: "department", value: "Sales" }], page: 0, size: 5 });
		const b = queryEmployees({ filters: [{ id: "department", value: "Sales" }], page: 1, size: 5 });

		expect(a.total).toBe(b.total);
		expect(a.data.map((d) => d.id)).not.toEqual(b.data.map((d) => d.id));
	});
});
