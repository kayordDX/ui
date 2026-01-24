<script lang="ts">
	import { DataTable, createShadTable } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";
	import type { ColumnDef, ColumnFiltersState, PaginationState, SortingState } from "@tanstack/table-core";
	import { Button } from "$lib";

	interface Todo {
		userId: number;
		id: number;
		title: string;
		completed: boolean;
	}

	let data = $state<Todo[]>([]);
	let rowCount = $derived(data.length ?? 0);
	let isLoading = $state(true);

	let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 });
	let columnFilters = $state<ColumnFiltersState>([]);

	const fetchData = async () => {
		isLoading = true;
		const res = await fetch("https://jsonplaceholder.typicode.com/todos");
		const json = await res.json();
		data = json;
		isLoading = false;
	};

	$effect(() => {
		fetchData();
	});

	const columns: ColumnDef<Todo>[] = [
		{
			accessorKey: "userId",
			header: "UserId",
			maxSize: 10,
		},
		{
			header: "id",
			accessorKey: "id",
			size: 10,
			minSize: 150,
		},
		{
			accessorKey: "title",
			cell: (info) => info.getValue(),
			size: 100000,
		},

		{
			header: "completed",
			accessorKey: "completed",
			size: 100,
			minSize: 150,
		},
	];

	let sorting = $state<SortingState>([]);

	const table = createShadTable({
		columns,
		get data() {
			return data;
		},
		state: {
			get pagination() {
				return pagination;
			},
			set pagination(v) {
				pagination = v;
			},
			get sorting() {
				return sorting;
			},
			set sorting(v) {
				sorting = v;
			},
			get columnFilters() {
				return columnFilters;
			},
		},
		get rowCount() {
			return rowCount;
		},
		enableRowSelection: true,
		manualPagination: true,
		manualFiltering: true,
		useURLSearchParams: true,
		// enableGlobalFilter: true,
		// useURLSearchParams: true,
		onPaginationChange: (updater) => {
			if (updater instanceof Function) {
				pagination = updater(pagination);
			} else pagination = updater;
		},
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
	});

	const fff = $derived(JSON.stringify(table.getState().globalFilter));
</script>

{JSON.stringify(sorting)}
<!-- {sortingState} -->
<div>
	test:
	{fff}
</div>
<div class="m-2">
	<Button onclick={() => table.setGlobalFilter("b")}>Set</Button>
	<Button onclick={() => table.setColumnFilters([{ id: "test", value: "test" }])}>Set Column Filter</Button>
	<Input bind:value={() => String(table.getState().globalFilter ?? ""), (v) => table.setGlobalFilter(v)} />
	<DataTable {table} headerClass="mt-2" {isLoading} />
</div>
