<script lang="ts">
	import type { ColumnDef } from "@tanstack/svelte-table";
	import { DataTable, createShadTable, type DataTableFeatures } from "$lib/data-table";
	import { getEmployees } from "$lib/server/employees.remote";
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

	// Uncontrolled table: sorting / filtering / pagination live in the table's
	// atoms. Data arrives async — fed through the getters below, which read the
	// `$derived` fetch result.
	const table = createShadTable({
		columns,
		get data() {
			return employees?.data ?? [];
		},
		get rowCount() {
			return employees?.total ?? 0;
		},
		// Everything is resolved server-side, so disable the client-side pipelines.
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		// New data arriving must not reset the page (that would fight the server).
		autoResetPageIndex: false,
		enableRowSelection: false,
	});

	// Remote fetch. Reads the table's atoms directly — each read is a dependency,
	// so the derived re-runs whenever the query changes. SvelteKit remote
	// functions run on the server when called from the browser, and the async
	// derived discards stale resolutions automatically.
	const employees: Awaited<ReturnType<typeof getEmployees>> = $derived(
		await getEmployees({
			q: table.atoms.globalFilter.get() ?? "",
			page: table.atoms.pagination.get().pageIndex,
			size: table.atoms.pagination.get().pageSize,
			sort:
				table.atoms.sorting
					.get()
					.map((s) => `${s.desc ? "-" : ""}${s.id}`)
					.join(",") || undefined,
			filters: table.atoms.columnFilters.get().map((f) => ({ id: f.id, value: f.value })),
		})
	);

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
			oninput={(e) => {
				table.setGlobalFilter(e.currentTarget.value);
				table.setPageIndex(0);
			}}
		/>
		<Input
			placeholder="Filter by department…"
			value={deptFilter}
			oninput={(e) => filterDepartment(e.currentTarget.value)}
		/>
	</div>

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
