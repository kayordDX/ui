<script lang="ts" generics="T">
	import { Table } from "$lib";
	import { FlexRender } from "$lib/data-table";
	import { type Header, type Table as TypeType } from "@tanstack/table-core";
	import { ArrowUpDownIcon, ArrowDownIcon, ArrowUpIcon } from "@lucide/svelte";

	interface Props<T> {
		header: Header<T, unknown>;
		table: TypeType<T>;
		disableUISorting?: boolean;
	}

	let { header, table, disableUISorting = false }: Props<T> = $props();

	const isSortingEnabled = $derived(table.options.getSortedRowModel !== undefined && disableUISorting !== true);

	const column = $derived(header.column);

	const currentSort = $derived.by(() => {
		const sortState = table.getState().sorting;
		return sortState.find((sort) => sort.id === column.id);
	});

	const sortDirection = $derived(currentSort ? (currentSort.desc ? "desc" : "asc") : null);
</script>

<Table.Head
	colspan={header.colSpan}
	class="bg-muted/20"
	style={`width: ${header.getSize()}px; min-width:${header.column.columnDef.minSize}px; max-width:${header.column.columnDef.maxSize}px`}
>
	{#if !header.isPlaceholder}
		<div class="flex items-center gap-1">
			<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
			{#if isSortingEnabled && header.column.getCanSort()}
				<button onclick={header.column.getToggleSortingHandler()}>
					{#if sortDirection == "asc"}
						<ArrowDownIcon class="size-4" />
					{:else if sortDirection == "desc"}
						<ArrowUpIcon class="size-4" />
					{:else}
						<ArrowUpDownIcon class="text-muted size-4" />
					{/if}
				</button>
			{/if}
		</div>
	{/if}
</Table.Head>
