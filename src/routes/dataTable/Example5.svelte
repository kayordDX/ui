<script lang="ts">
	import type { ColumnDef, ColumnFiltersState, PaginationState, SortingState, Updater } from "@tanstack/svelte-table";
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

	// Controlled table state — every change triggers a server fetch.
	let globalFilter = $state("");
	let columnFilters = $state<ColumnFiltersState>([]);
	let sorting = $state<SortingState>([]);
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

	const apply = <T,>(updater: Updater<T>, prev: T): T =>
		typeof updater === "function" ? (updater as (old: T) => T)(prev) : updater;

	const resetPage = () => (pagination = { ...pagination, pageIndex: 0 });

	// Re-fetch whenever search / sort / filter / page changes. All dependency
	// reads happen synchronously (before the await), so $effect tracks them.
	let lastRequestId = 0;
	$effect(() => {
		const q = globalFilter;
		const { pageIndex, pageSize } = pagination;
		const sort = sorting.map((s) => `${s.desc ? "-" : ""}${s.id}`).join(",") || "-id";
		const filters = JSON.stringify(columnFilters);

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
		enableRowSelection: false,
		state: {
			get globalFilter() {
				return globalFilter;
			},
			get columnFilters() {
				return columnFilters;
			},
			get sorting() {
				return sorting;
			},
			get pagination() {
				return pagination;
			},
		},
		onGlobalFilterChange: (u) => {
			globalFilter = apply(u, globalFilter);
			resetPage();
		},
		onColumnFiltersChange: (u) => {
			columnFilters = apply(u, columnFilters);
			resetPage();
		},
		onSortingChange: (u) => {
			sorting = apply(u, sorting);
			resetPage();
		},
		onPaginationChange: (u) => {
			pagination = apply(u, pagination);
		},
	});

	const deptFilter = $derived(String(columnFilters.find((f) => f.id === "department")?.value ?? ""));
	function filterDepartment(value: string) {
		table.setColumnFilters(value ? [{ id: "department", value }] : []);
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
