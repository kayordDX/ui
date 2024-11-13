<script lang="ts" generics="T">
	import { FlexRender, Table } from "$lib";
	import { type Header, type Table as TypeType } from "@tanstack/table-core";
	import { ArrowUpDownIcon, ArrowDownIcon, ArrowUpIcon, XIcon, FilterIcon } from "lucide-svelte";

	interface Props<T> {
		header: Header<T, unknown>;
		table: TypeType<T>;
		disableUISorting?: boolean;
	}

	let { header, table, disableUISorting = false }: Props<T> = $props();

	const isSortingEnabled = $derived(table.options.getSortedRowModel !== undefined && disableUISorting !== true);
</script>

<Table.Head
	colspan={header.colSpan}
	style={`width: ${header.getSize()}px; min-width:${header.column.columnDef.minSize}px; max-width:${header.column.columnDef.maxSize}px`}
>
	{#if !header.isPlaceholder}
		<div class="flex items-center gap-1">
			<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
			{#if isSortingEnabled}
				<button onclick={header.column.getToggleSortingHandler()}>
					{#if header.column.getIsSorted() == "asc"}
						<ArrowDownIcon class="size-4" />
					{:else if header.column.getIsSorted() == "desc"}
						<ArrowUpIcon class="size-4" />
					{:else}
						<ArrowUpDownIcon class="size-4 text-muted" />
					{/if}
				</button>
			{/if}
		</div>
	{/if}
</Table.Head>
