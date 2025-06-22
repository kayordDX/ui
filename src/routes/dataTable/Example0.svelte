<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { type ColumnDef } from "@tanstack/table-core";
	import { data } from "./data.svelte";
	import { DataTable, createShadTable } from "$lib";
	import Input from "$lib/components/ui/input/input.svelte";
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import {
		decodePageIndex,
		decodeSorting,
		encodeTableState,
	} from "$lib/components/custom/data-table/table-search-params";

	let search = $state(page.url.searchParams.get("globalFilter") ?? "");

	$effect(() => {
		const params = encodeTableState(table.getState());
		goto(params, {
			replaceState: true,
			keepFocus: true,
			noScroll: true,
		});
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
		initialState: {
			pagination: {
				pageIndex: decodePageIndex(),
			},
			sorting: decodeSorting(),
		},
		state: {
			get globalFilter() {
				return search;
			},
		},
	});
</script>

<Input bind:value={search} />
<DataTable {table} enableFullscreen headerClass="mt-2" />
