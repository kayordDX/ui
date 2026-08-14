import { describe, it, expect } from "vitest";
import { createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";

interface Row {
	id: number;
	name: string;
	day: string;
}

const columns: ColumnDef<DataTableFeatures, Row>[] = [
	{ accessorKey: "id", header: "ID", maxSize: 10 },
	{ accessorKey: "name" },
	{ accessorKey: "day" },
];

const data: Row[] = Array.from({ length: 50 }, (_, i) => ({
	id: i + 1,
	name: `name-${i}`,
	day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
}));

const flushMicrotasks = () => new Promise((r) => setTimeout(r, 0));

describe("useTableUrlSync paging hydration", () => {
	it("keeps the URL-backed page when hydration runs before the first render", async () => {
		const table = createShadTable({ columns, data, enableRowSelection: false });

		// useTableUrlSync hydrates the table from the URL at init, before the
		// DataTable's first render.
		table.setSorting([{ id: "name", desc: true }]);
		table.setPageIndex(2);

		table.getRowModel(); // first render — row models skip auto-reset on first run
		table.getRowModel(); // later render passes — row-model deps are unchanged
		await flushMicrotasks();

		expect(table.atoms.pagination.get().pageIndex).toBe(2);
	});

	it("post-mount sorting changes still auto-reset the page (native behavior preserved)", async () => {
		const table = createShadTable({ columns, data, enableRowSelection: false });

		table.getRowModel(); // first render

		// User sorts after mount: the row-model pipeline re-runs and defers an
		// autoResetPageIndex microtask — this is the desired snap-back-to-page-1.
		table.setSorting([{ id: "name", desc: true }]);
		table.setPageIndex(2);
		table.getRowModel();
		await flushMicrotasks();

		expect(table.atoms.pagination.get().pageIndex).toBe(0);
	});
});
