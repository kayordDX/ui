<script lang="ts" generics="T">
	import { createGrid } from "$lib/data-grid";
	import { createSvelteTable } from "$lib/data-table";
	import { getCoreRowModel, type TableOptions, type ColumnDef, type Table } from "@tanstack/table-core";

	interface Props<T> {
		columns: ColumnDef<T, unknown>[];
		data: T[];
		table?: Table<T>;
	}

	let { data, columns, table = $bindable() }: Props<T> = $props();

	// const options = $state<TableOptions<T>>({
	// 	get data() {
	// 		return data;
	// 	},
	// 	columns,
	// 	getCoreRowModel: getCoreRowModel(),
	// });

	table = createGrid({
		columns: () => columns,
		data: () => data,
	});
</script>

<div>Table</div>
<pre>
	{JSON.stringify(table.getState().globalFilter, null, 2)}
</pre>
{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
	<div>
		HeaderGroup {headerGroup.id}
		{#each headerGroup.headers as header (header.id)}
			<div>
				{header.id}
			</div>
		{/each}
	</div>
{/each}
