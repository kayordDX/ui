<script lang="ts">
	import type { ColumnDef, SortingState } from "@tanstack/svelte-table";
	import { DataTable, createShadTable, type DataTableFeatures } from "$lib/data-table";
	import { getEmployees } from "./employees.remote";

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

	let sorting = $state<SortingState>([]);

	const table = createShadTable({
		columns,
		get data() {
			return employees?.data ?? [];
		},
		get rowCount() {
			return employees?.total ?? 0;
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === "function" ? updater(sorting) : updater;
		},
		// Everything is resolved server-side, so disable the client-side pipelines.
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		// New data arriving must not reset the page (that would fight the server).
		autoResetPageIndex: false,
		enableRowSelection: false,
		state: {
			get sorting() {
				return sorting;
			},
		},
	});

	const employees = await getEmployees({
		q: "",
		page: 1,
		size: 10,
		sort: sorting.toString(),
		filters: [],
	});
</script>

<div class="m-4 flex flex-col gap-2">
	<p class="text-muted-foreground text-sm">{employees.total} matching records (server-side)</p>
	<DataTable {table} headerClass="mt-2" enableFullscreen />
</div>
