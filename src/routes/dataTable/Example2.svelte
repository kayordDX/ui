<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { type ColumnDef, type SortingState } from "@tanstack/table-core";

	import { data } from "./data.svelte";
	import { Button, createShadTable, DataTable } from "$lib";
	import { ShadTable } from "$lib/components/custom/data-table/shad-table.svelte";

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

	let table = createShadTable({
		columns,
		get data() {
			return data.value;
		},
		enableSorting: true,
		enableRowSelection: false,
		enablePaging: true,
		enableVisibility: true,
	});

	let test = new ShadTable({
		columns,
		get data() {
			return data.value;
		},
		enableSorting: true,
		enableRowSelection: false,
		enablePaging: true,
		enableVisibility: true,
	});

	const addRecord = () => {
		// data.value.push({ day: "1", id: 99, name: "1" });
		data.value = [...data.value, { day: "1", id: 99, name: "1" }];
	};
</script>

<DataTable bind:tableState={test} headerClass="mt-2" enableVisibility />

<Button onclick={addRecord}>Add Record</Button>
