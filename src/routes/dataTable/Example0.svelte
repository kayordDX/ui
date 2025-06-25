<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { type ColumnDef } from "@tanstack/table-core";
	import { data } from "./data.svelte";
	import { DataTable, createShadTable } from "$lib";
	import Input from "$lib/components/ui/input/input.svelte";
	import {
		decodeColumnFilters,
		decodeGlobalFilter,
		decodePageIndex,
		decodeSorting,
		decodeTableState,
		encodeTableState,
	} from "$lib/components/custom/data-table/table-search-params";
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";

	let search = $state("");

	onMount(() => {
		search = decodeGlobalFilter();
	});

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

	const table = createShadTable({
		columns,
		data: data.value,
		enableRowSelection: false,
		state: {
			get globalFilter() {
				return search;
			},
		},
		defaultState: decodeTableState(),
	});

	$effect(() => {
		const params = encodeTableState(table.getState());
		goto(params, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
	});
</script>

<Input bind:value={search} />
<DataTable {table} enableFullscreen headerClass="mt-2" />
