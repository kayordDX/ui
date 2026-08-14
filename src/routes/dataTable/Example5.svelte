<script lang="ts">
	import type { ColumnDef, PaginationState, SortingState } from "@tanstack/svelte-table";
	import { DataTable, createShadTable, type DataTableFeatures } from "$lib/data-table";
	import { getEmployees } from "./employees.remote";
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

	// External, controlled state — a single reactive object. The server query
	// below derives from it (mirroring a TanStack Query queryKey), and
	// createShadTable wires it into the table via `state` getters + `on*Change`
	// handlers, so no boilerplate is needed here.
	const tableState = $state({
		sorting: [] as SortingState,
		globalFilter: "",
		pagination: { pageIndex: 0, pageSize: 10 } as PaginationState,
	});

	const table = createShadTable({
		columns,
		controlledState: tableState,
		// New search/sort snap back to page 1.
		resetPageIndexOn: ["sorting", "globalFilter"],
		// Server-side: current page + total come from the remote function.
		get data() {
			return employees?.data ?? [];
		},
		get rowCount() {
			return employees?.total ?? 0;
		},
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		autoResetPageIndex: false,
		enableRowSelection: false,
	});

	// Query derived from the controlled state — re-runs on any change, and the
	// async derived discards stale responses automatically.
	const employees: Awaited<ReturnType<typeof getEmployees>> = $derived(
		await getEmployees({
			q: tableState.globalFilter,
			page: tableState.pagination.pageIndex,
			size: tableState.pagination.pageSize,
			sort: tableState.sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") || undefined,
			filters: [],
		})
	);
</script>

<div class="m-4 flex flex-col gap-2">
	<Input
		placeholder="Search all fields…"
		value={tableState.globalFilter}
		oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
	/>

	<svelte:boundary>
		{#snippet pending()}
			<p class="text-muted-foreground text-sm">Loading…</p>
		{/snippet}
		{#snippet failed(error)}
			<p class="text-destructive text-sm">{(error as Error).message}</p>
		{/snippet}

		<p class="text-muted-foreground text-sm">{employees.total} matching records (server-side)</p>
		<DataTable {table} headerClass="mt-2" enableFullscreen />
	</svelte:boundary>
</div>
