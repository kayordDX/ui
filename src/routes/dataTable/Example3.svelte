<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { data } from "./data.svelte";
	import { Button } from "$lib";
	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";

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
		get data() {
			return data.value;
		},
		enableRowSelection: false,
		enableGlobalFilter: true,
	});
</script>

<DataTable {table} headerClass="mt-2" enableVisibility enableFullscreen />
<Button onclick={() => table.setColumnFilters([{ id: "name", value: "z" }])}>Filter 1</Button>
<Button onclick={() => table.resetColumnFilters()}>Reset</Button>
<Button onclick={() => table.setGlobalFilter("z")}>Global Filter</Button>
<Button onclick={() => table.resetGlobalFilter()}>Reset Global</Button>
