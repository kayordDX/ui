<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { data } from "./data.svelte";
	import { DataTable, createShadTable, renderSnippet, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import { aggregationFns } from "$lib/components/custom/data-table/data-table-utils";
	import { CloudIcon, SunIcon } from "@lucide/svelte";

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			maxSize: 10,
			footer: () => aggregationFns.sum(data.value, "id"),
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
		{
			id: "weather",
			header: "Weather",
			size: 100,
			minSize: 150,
			cell: () => renderSnippet(weatherSnippet, { weather: Math.round(Math.random()) }),
		},
	];

	// v9 owns table state internally — no `state`/`onRowSelectionChange` plumbing.
	const table = createShadTable({
		columns,
		data: data.value,
		enableRowSelection: true,
	});
</script>

{#snippet weatherSnippet(param: { weather: number })}
	{#if param.weather === 0}
		<SunIcon class="mr-1 inline size-4 text-yellow-400" />
	{:else}
		<CloudIcon class="inline size-4 text-blue-400" />
	{/if}
{/snippet}

<DataTable {table} enableVisibility enableFullscreen headerClass="mt-2" />
