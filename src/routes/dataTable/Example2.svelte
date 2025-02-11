<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { getCoreRowModel, type ColumnDef } from "@tanstack/table-core";

	import { data } from "./data.svelte";
	import { Button, createShadTable, createSvelteTable, DataTable } from "$lib";

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

	const table = createSvelteTable({
		columns,
		get data() {
			return data.value;
		},
		getCoreRowModel: getCoreRowModel(),
		enableRowSelection: false,
		// enablePaging: false,
	});
	const addRecord = () => {
		data.value.push({ day: "1", id: 99, name: "1" });
		data.value = [...data.value, { day: "1", id: 99, name: "1" }];
	};
</script>

<DataTable {table} {columns} headerClass="mt-2" enableVisibility />

<Button onclick={addRecord}>Add Record</Button>
