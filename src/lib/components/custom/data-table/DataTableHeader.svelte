<script lang="ts" generics="T extends RowData">
	import { Table } from "$lib";
	import { FlexRender } from "$lib/components/ui/data-table";
	import type { Header, RowData } from "@tanstack/svelte-table";
	import { ArrowUpDownIcon, ArrowDownIcon, ArrowUpIcon } from "@lucide/svelte";
	import type { DataTableFeatures } from "./features";

	interface Props<T extends RowData> {
		header: Header<DataTableFeatures, T, unknown>;
		disableUISorting?: boolean;
	}

	let { header, disableUISorting = false }: Props<T> = $props();

	const isSortingEnabled = $derived(disableUISorting !== true);
</script>

<Table.Head
	colspan={header.colSpan}
	class="bg-muted/20"
	style={`width: ${header.getSize()}px; min-width:${header.column.columnDef.minSize}px; max-width:${header.column.columnDef.maxSize}px`}
>
	{#if !header.isPlaceholder}
		<div class="flex items-center gap-1">
			<FlexRender {header} />
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
