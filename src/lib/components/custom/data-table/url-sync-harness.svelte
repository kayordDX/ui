<script lang="ts">
	import { createShadTable, useTableUrlSync, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import DataTable from "./DataTable.svelte";

	interface DataType {
		id: number;
		name: string;
		day: string;
	}

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
		{ accessorKey: "id", header: "ID", maxSize: 10 },
		{ accessorKey: "name", size: 100000 },
		{ accessorKey: "day", size: 100, minSize: 150 },
	];

	let { renderTable = false }: { renderTable?: boolean } = $props();

	const tableData: DataType[] = Array.from({ length: 50 }, (_, i) => ({
		id: i + 1,
		name: `name-${i}`,
		day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i % 7],
	}));

	export const table = createShadTable({
		columns,
		data: tableData,
		enableRowSelection: false,
	});

	useTableUrlSync(table);
</script>

{#if renderTable}
	<DataTable {table} />
{/if}
