<script lang="ts">
	import { DataTable, createShadTable } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";
	import type { ColumnDef, SortingState } from "@tanstack/table-core";
	import { Button } from "$lib";

	interface Todo {
		userId: number;
		id: number;
		title: string;
		completed: boolean;
	}

	let data = $state<Todo[]>([]);
	let isLoading = $state(true);

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

	// let tableState = $state({
	// 	pagination: { pageIndex: 0, pageSize: 10 },
	// 	sorting: [],
	// });
	let sorting = $state<SortingState>([]);

	const table = createShadTable({
		columns,
		get data() {
			return data;
		},
		enableRowSelection: true,
		// enableGlobalFilter: true,
		// useURLSearchParams: true,
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		state: {
			get sorting() {
				return sorting;
			},
		},
	});

	// const sortingState = $derived(JSON.stringify(table.getState().sorting));

	// $effect(() => {
	// 	const s = tableState;
	// 	untrack(() => {
	// 		console.log("Effect2 ", s);
	// 	});
	// });

	// $effect(() => {
	// 	const s = table.getState();
	// 	untrack(() => {
	// 		console.log("Effect table.getState()", s);
	// 	});
	// });

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
	<Input bind:value={() => String(table.getState().globalFilter ?? ""), (v) => table.setGlobalFilter(v)} />
	<DataTable {table} headerClass="mt-2" {isLoading} />
</div>
