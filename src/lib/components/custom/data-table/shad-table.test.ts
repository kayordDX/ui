import { describe, expect, it } from "vitest";
import { createShadTable, type ControlledState } from "./shad-table.svelte";
import type { ColumnDef } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";

interface Row {
	id: number;
	name: string;
}

const columns: ColumnDef<DataTableFeatures, Row>[] = [{ accessorKey: "id", header: "ID" }];

const data = Array.from({ length: 30 }, (_, i) => ({ id: i + 1, name: `row-${i + 1}` }));

function makeState() {
	return {
		sorting: [] as { id: string; desc: boolean }[],
		globalFilter: "",
		pagination: { pageIndex: 0, pageSize: 10 },
	} as ControlledState;
}

describe("resetPageIndexOn default", () => {
	it("never resets the page when the page itself changes", () => {
		const controlledState = makeState();
		const table = createShadTable({
			columns,
			get data() {
				return data;
			},
			controlledState,
		});

		table.setPageIndex(2);
		expect(controlledState.pagination?.pageIndex).toBe(2);

		table.setPageSize(5);
		expect(controlledState.pagination?.pageIndex).not.toBe(0);
	});

	it("resets page index on any controlled state change when unset", () => {
		const controlledState = makeState();
		const table = createShadTable({
			columns,
			get data() {
				return data;
			},
			controlledState,
		});

		table.setPageIndex(2);
		expect(controlledState.pagination?.pageIndex).toBe(2);

		table.setSorting([{ id: "id", desc: false }]);
		expect(controlledState.pagination?.pageIndex).toBe(0);

		table.setPageIndex(2);
		table.setGlobalFilter("row");
		expect(controlledState.pagination?.pageIndex).toBe(0);
	});

	it("resets page index on any controlled state change when explicitly undefined", () => {
		const controlledState = makeState();
		const table = createShadTable({
			columns,
			get data() {
				return data;
			},
			controlledState,
			resetPageIndexOn: undefined,
		});

		table.setPageIndex(2);
		table.setGlobalFilter("row");
		expect(controlledState.pagination?.pageIndex).toBe(0);
	});

	it("only resets page index for listed keys when overridden", () => {
		const controlledState = makeState();
		const table = createShadTable({
			columns,
			get data() {
				return data;
			},
			controlledState,
			resetPageIndexOn: ["sorting"],
		});

		table.setPageIndex(2);
		table.setGlobalFilter("row");
		expect(controlledState.pagination?.pageIndex).toBe(2);

		table.setSorting([{ id: "id", desc: false }]);
		expect(controlledState.pagination?.pageIndex).toBe(0);
	});
});
