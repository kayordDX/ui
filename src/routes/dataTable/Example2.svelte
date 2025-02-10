<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { type ColumnDef } from "@tanstack/table-core";

	import { getData } from "./data";
	import { createShadTable, DataTable } from "$lib";

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

	const data = getData();

	const table = createShadTable({
		columns,
		data,
		enableSorting: true,
		enablePaging: false,
	});
</script>

<DataTable {table} {columns} headerClass="mt-2" />
