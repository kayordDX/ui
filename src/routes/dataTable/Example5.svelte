<script lang="ts">
	import type { ColumnDef } from "@tanstack/svelte-table";
	import { DataTable, createShadTable, type DataTableFeatures } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";

	interface Employee {
		id: number;
		firstName: string;
		lastName: string;
		email: string;
		department: string;
		role: string;
		salary: number;
		status: "active" | "inactive";
	}

	const columns: ColumnDef<DataTableFeatures, Employee>[] = [
		{ accessorKey: "id", header: "ID", maxSize: 10 },
		{ accessorKey: "firstName", header: "First" },
		{ accessorKey: "lastName", header: "Last" },
		{ accessorKey: "email", header: "Email" },
		{ accessorKey: "department", header: "Dept" },
		{ accessorKey: "role", header: "Role" },
		{ accessorKey: "salary", header: "Salary", cell: (c) => `$${c.row.original.salary.toLocaleString()}` },
		{ accessorKey: "status", header: "Status" },
	];

	// Server response (the current page + the total row count).
	let rows = $state<Employee[]>([]);
	let total = $state(0);
	let isLoading = $state(true);

	// Uncontrolled table: sorting / filtering / pagination live in the table's
	// atoms, and every change triggers a server fetch (below).
	const table = createShadTable({
		columns,
		// Use getters so the table re-reads these as the server responds — `data`
		// is the current page and `rowCount` is the server's total (drives the
		// page count). Plain values would be snapshotted once.
		get data() {
			return rows;
		},
		get rowCount() {
			return total;
		},
		// Everything is resolved server-side, so disable the client-side pipelines.
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		// New data arriving must not reset the page (that would fight the server).
		autoResetPageIndex: false,
		enableRowSelection: false,
	});

	// Re-fetch whenever search / sort / filter / page changes. All dependency
	// reads happen synchronously (before the await), so $effect tracks them.
	let lastRequestId = 0;
	let lastQueryKey: string | undefined;
	$effect(() => {
		const q = table.atoms.globalFilter.get() ?? "";
		const { pageIndex, pageSize } = table.atoms.pagination.get();
		const sort =
			table.atoms.sorting
				.get()
				.map((s) => `${s.desc ? "-" : ""}${s.id}`)
				.join(",") || "-id";
		const filters = JSON.stringify(table.atoms.columnFilters.get());

		// Reset to page 1 when the query changes (but not on the initial run).
		const queryKey = `${q}|${filters}|${sort}`;
		if (lastQueryKey !== undefined && queryKey !== lastQueryKey) {
			table.setPageIndex(0);
		}
		lastQueryKey = queryKey;

		const requestId = ++lastRequestId;
		isLoading = true;
		const params = new URLSearchParams({
			q,
			page: String(pageIndex),
			size: String(pageSize),
			sort,
			filters,
		});
		fetch(`/api/employees?${params}`)
			.then((r) => r.json())
			.then((res: { data: Employee[]; total: number }) => {
				if (requestId !== lastRequestId) return; // a newer request superseded this one
				rows = res.data;
				total = res.total;
			})
			.finally(() => {
				if (requestId === lastRequestId) isLoading = false;
			});
	});

	const globalFilter = $derived(table.atoms.globalFilter.get() ?? "");
	const deptFilter = $derived(String(table.atoms.columnFilters.get().find((f) => f.id === "department")?.value ?? ""));
	function filterDepartment(value: string) {
		table.setColumnFilters(value ? [{ id: "department", value }] : []);
		table.setPageIndex(0);
	}
</script>

<div class="m-4 flex flex-col gap-2">
	<div class="flex flex-wrap gap-2">
		<Input
			placeholder="Search all fields…"
			value={globalFilter}
			oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
		/>
		<Input
			placeholder="Filter by department…"
			value={deptFilter}
			oninput={(e) => filterDepartment(e.currentTarget.value)}
		/>
	</div>

	<p class="text-muted-foreground text-sm">{total} matching records (server-side)</p>

	<DataTable {table} {isLoading} headerClass="mt-2" enableFullscreen />
</div>
