<script lang="ts" generics="T">
	import { FlexRender, Table } from "$lib";
	import { type Header, type Table as TypeType } from "@tanstack/table-core";
	import { ArrowUpDownIcon, ArrowDownIcon, ArrowUpIcon } from "@lucide/svelte";
	import type { ShadTable } from "./shad-table.svelte";

	interface Props<T> {
		headerGroupIndex: number;
		headerIndex: number;
		tableState: ShadTable<T>;
		disableUISorting?: boolean;
	}

	let { headerGroupIndex, headerIndex, tableState = $bindable(), disableUISorting = false }: Props<T> = $props();

	const isSortingEnabled = $derived(
		tableState.table.options.getSortedRowModel !== undefined && disableUISorting !== true
	);

	const header = tableState.table.getHeaderGroups()[headerGroupIndex].headers[headerIndex];
</script>

<Table.Head
	colspan={header.colSpan}
	style={`width: ${header.getSize()}px; min-width:${header.column.columnDef.minSize}px; max-width:${header.column.columnDef.maxSize}px`}
>
	{#if !header.isPlaceholder}
		<div class="flex items-center gap-1">
			<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
			{#if isSortingEnabled && header.column.getCanSort()}
				<button onclick={header.column.getToggleSortingHandler()}>
					{#if header.column.getIsSorted() == "asc"}
						<ArrowDownIcon class="size-4" />
					{:else if header.column.getIsSorted() == "desc"}
						<ArrowUpIcon class="size-4" />
					{:else}
						<ArrowUpDownIcon class="text-muted size-4" />
					{/if}
				</button>
			{/if}
		</div>
	{/if}
</Table.Head>
