<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { type ColumnDef } from "@tanstack/table-core";
	import { data } from "./data.svelte";
	import { DataTable, createShadTable } from "$lib";
	import Input from "$lib/components/ui/input/input.svelte";
	import { decodeGlobalFilter } from "$lib/components/custom/data-table/table-search-params";

	let search = $state(decodeGlobalFilter());

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
		useURLSearchParams: true,
		state: {
			get globalFilter() {
				return search;
			},
		},
	});
</script>

<Input bind:value={search} />
<DataTable {table} enableFullscreen headerClass="mt-2" />
