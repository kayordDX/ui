<script lang="ts">
	import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-svelte";

	import { flexRender, type Table as TableType } from "@tanstack/svelte-table";
	import { Button, DropdownMenu, Skeleton, Table } from "$lib";
	import type { Readable } from "svelte/store";

	type T = $$Generic<MRT_RowData>;
	export let table: Readable<TableType<T>>;
	export let isLoading: boolean = false;
</script>

<Table.Body>
	{#if isLoading}
		{#each { length: 5 } as _, i}
			<Table.Row>
				{#each $table.getAllColumns() as col}
					<Table.Cell>
						<Skeleton class="h-4" />
					</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	{:else}
		{#each $table.getRowModel().rows as row}
			<Table.Row>
				{#each row.getVisibleCells() as cell}
					<Table.Cell>
						<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
					</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	{/if}
</Table.Body>
