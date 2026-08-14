<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { data } from "./data.svelte";
	import { DataTable, createShadTable, useTableUrlSync, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
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
	});

	// Keep search / sort / filter / page in sync with the URL.
	useTableUrlSync(table);

	function filterName(value: string) {
		table.setColumnFilters(value ? [{ id: "name", value }] : []);
	}

	const pagination = $derived(table.atoms.pagination.get());
	const sorting = $derived(table.atoms.sorting.get());
</script>

<Input
	placeholder="search"
	value={String(table.atoms.columnFilters.get().find((f) => f.id === "name")?.value ?? "")}
	oninput={(e) => filterName(e.currentTarget.value)}
/>
<DataTable {table} enableFullscreen headerClass="mt-2" />

<pre>Pagination: {JSON.stringify(pagination)}</pre>
<pre>Sorting: {JSON.stringify(sorting)}</pre>
