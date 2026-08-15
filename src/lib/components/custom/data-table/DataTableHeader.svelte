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

	function headerSizeStyle(width: number, min?: number, max?: number) {
		const styles = [`width: ${width}px`];
		if (min !== undefined) styles.push(`min-width: ${min}px`);
		if (max !== undefined) styles.push(`max-width: ${max}px`);
		return styles.join("; ");
	}

	const isSortingEnabled = $derived(disableUISorting !== true);
	const sorted = $derived(header.column.getIsSorted());
	const ariaSort = $derived(sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined);
</script>

<Table.Head
	colspan={header.colSpan}
	aria-sort={ariaSort}
	class="bg-muted/20"
	style={headerSizeStyle(header.getSize(), header.column.columnDef.minSize, header.column.columnDef.maxSize)}
>
	{#if !header.isPlaceholder}
		<div class="flex items-center gap-1">
			<FlexRender {header} />
			{#if isSortingEnabled && header.column.getCanSort()}
				<button
					aria-label={`Sort by ${header.column.id}`}
					class="cursor-pointer"
					onclick={header.column.getToggleSortingHandler()}
				>
					{#if sorted == "asc"}
						<ArrowDownIcon class="size-4" />
					{:else if sorted == "desc"}
						<ArrowUpIcon class="size-4" />
					{:else}
						<ArrowUpDownIcon class="text-muted size-4" />
					{/if}
				</button>
			{/if}
		</div>
	{/if}
</Table.Head>
