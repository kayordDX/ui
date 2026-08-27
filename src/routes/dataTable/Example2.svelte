<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { data } from "./data.svelte";
	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import { Button } from "$lib";

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
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

	const table = createShadTable({
		columns,
		manualPagination: true,
		get data() {
			return data.value;
		},
		enableRowSelection: false,
	});

	const addRecord = () => {
		data.value = [...data.value, { day: "1", id: 99, name: "1" }];
	};
</script>

<DataTable {table} headerClass="mt-2" enableVisibility enableFullscreen pagination={false} />

<Button onclick={addRecord}>Add Record</Button>
