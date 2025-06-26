<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { type ColumnDef, type TableState } from "@tanstack/table-core";

	import { data } from "./data.svelte";
	import { Button, DataTable } from "$lib";
	import { createShadTable } from "$lib/components/custom/data-table/shad-table.svelte";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			header: "Id",
			maxSize: 10,
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: (info) => info.getValue(),
			size: 100000,
			meta: {
				className: "whitespace-pre",
			},
		},
		{
			header: "Day",
			accessorKey: "day",
			size: 100,
			minSize: 150,
		},
	];

	let sss = $state<Partial<TableState>>({});

	const table = createShadTable({
		columns,
		get data() {
			return data.value;
		},
		state: sss,
		enableRowSelection: false,
		enableVisibility: true,
		enablePaging: false,
	});

	const addRecord = () => {
		// data.value.push({ day: "1", id: 99, name: "1" });
		data.value = [...data.value, { day: "1", id: 99, name: "1" }];
	};
</script>

<DataTable {table} headerClass="mt-2" enableVisibility enableFullscreen />

<Button onclick={addRecord}>Add Record</Button>
