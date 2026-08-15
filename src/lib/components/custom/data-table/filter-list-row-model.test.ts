import { describe, expect, it } from "vitest";
import type { ColumnFiltersState } from "@tanstack/svelte-table";
import { createShadTable, type ColumnDef, type DataTableFeatures, type ExtendedColumnFilter } from "$lib/data-table";

interface Row {
	id: number;
	name: string;
	day: string;
	tags: string[];
}

const data: Row[] = [
	{ id: 1, name: "alice", day: "Mon", tags: ["admin", "editor"] },
	{ id: 2, name: "bob", day: "Tue", tags: ["viewer"] },
	{ id: 3, name: "charlie", day: "Mon", tags: ["editor"] },
];

const columns: ColumnDef<DataTableFeatures, Row>[] = [
	{ accessorKey: "id" },
	{ accessorKey: "name" },
	{ accessorKey: "day" },
	{ accessorKey: "tags" },
];

const flushMicrotasks = () => new Promise((r) => setTimeout(r, 0));

function createTable() {
	return createShadTable({ columns, data, enableRowSelection: false });
}

function setFilters(table: ReturnType<typeof createTable>, filters: ExtendedColumnFilter[]) {
	table.options.onColumnFiltersChange?.(filters as ColumnFiltersState);
}

const rowValues = (table: ReturnType<typeof createTable>) => table.getRowModel().rows.map((row) => row.original.name);

describe("createFilterListRowModel", () => {
	it("filters with an extended operator", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [{ id: "name", value: "ali", operator: "contains", filterId: "f1", joinOperator: "and" }]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["alice"]);
	});

	it("combines filters with and by default", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [
			{ id: "day", value: "Mon", operator: "equals", filterId: "f1", joinOperator: "and" },
			{ id: "id", value: 2, operator: "greaterThan", filterId: "f2", joinOperator: "and" },
		]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["charlie"]);
	});

	it("combines filters with or", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [
			{ id: "id", value: 1, operator: "equals", filterId: "f1", joinOperator: "and" },
			{ id: "name", value: "charlie", operator: "equals", filterId: "f2", joinOperator: "or" },
		]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["alice", "charlie"]);
	});

	it("combines mixed and/or joins left-to-right", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [
			{ id: "id", value: 1, operator: "greaterThan", filterId: "f1", joinOperator: "and" },
			{ id: "name", value: "charlie", operator: "notEquals", filterId: "f2", joinOperator: "or" },
			{ id: "day", value: "Mon", operator: "equals", filterId: "f3", joinOperator: "and" },
		]);
		table.getRowModel();
		await flushMicrotasks();

		// (id > 1 || name != "charlie") && day == "Mon"
		// alice:  false || true  → true  && Mon → included
		// bob:    true  || true  → true  && Tue → excluded
		// charlie:true  || false → true  && Mon → included
		expect(rowValues(table)).toEqual(["alice", "charlie"]);
	});

	it("evaluates doesNotStartWith / doesNotEndWith through the table", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [{ id: "name", value: "al", operator: "doesNotStartWith", filterId: "f1", joinOperator: "and" }]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["bob", "charlie"]);
	});

	it("evaluates includesNone through the table", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [
			{ id: "tags", value: ["admin"], operator: "includesNone", filterId: "f1", joinOperator: "and" },
		]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["bob", "charlie"]);
	});

	it("keeps stock semantics for plain filters", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [{ id: "day", value: "Mon" }]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["alice", "charlie"]);
	});

	it("keeps the global filter working", async () => {
		const table = createTable();
		table.getRowModel();
		table.setGlobalFilter("bob");
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["bob"]);
	});

	it("ignores inactive (empty) extended filters", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [{ id: "name", value: "", operator: "equals", filterId: "f1", joinOperator: "and" }]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table).length).toBe(3);
	});

	it("applies multiple operators on the same column", async () => {
		const table = createTable();
		table.getRowModel();
		setFilters(table, [
			{ id: "id", value: 1, operator: "greaterThan", filterId: "f1", joinOperator: "and" },
			{ id: "id", value: 3, operator: "lessThan", filterId: "f2", joinOperator: "and" },
		]);
		table.getRowModel();
		await flushMicrotasks();

		expect(rowValues(table)).toEqual(["bob"]);
	});

	it("works with manualFiltering: state is readable, rows are left to the server", async () => {
		const table = createShadTable({ columns, data, enableRowSelection: false, manualFiltering: true });
		table.getRowModel();
		setFilters(table, [{ id: "name", value: "bob", operator: "equals", filterId: "f1", joinOperator: "and" }]);
		table.getRowModel();
		await flushMicrotasks();

		expect(table.atoms.columnFilters.get()).toEqual([
			{ id: "name", value: "bob", operator: "equals", filterId: "f1", joinOperator: "and" },
		]);
		expect(rowValues(table)).toEqual(["alice", "bob", "charlie"]);
	});
});
