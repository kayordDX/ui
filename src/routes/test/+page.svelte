<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { data } from "../dataTable/data.svelte";
	import { DataTable, createShadTable } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";
	import type { ColumnDef, SortingState } from "@tanstack/table-core";
	import { untrack } from "svelte";
	import { Button } from "$lib";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			maxSize: 10,
		},
		{
			accessorKey: "name",
			cell: (info) => info.getValue(),
			size: 100000,
		},
		{
			header: "Day",
			accessorKey: "day",
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
		data: data.value,
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

	$effect(() => {
		const s = table.getState();
		untrack(() => {
			console.log("Effect table.getState()", s);
		});
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
	<Input bind:value={() => String(table.getState().globalFilter ?? ""), (v) => table.setGlobalFilter(v)} />
	<DataTable {table} headerClass="mt-2" />
</div>
