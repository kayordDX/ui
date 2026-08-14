<script lang="ts" generics="T extends RowData">
	import { Button, Table } from "$lib";
	import { FlexRender } from "$lib/components/ui/data-table";
	import type { Header, RowData } from "@tanstack/svelte-table";
	import { ArrowUpDownIcon, ArrowDownIcon, ArrowUpIcon } from "@lucide/svelte";
	import type { DataTableFeatures } from "./features";

	interface Props<T extends RowData> {
		header: Header<DataTableFeatures, T, unknown>;
	}

	let { header }: Props<T> = $props();

	const sorted = $derived(header.column.getIsSorted());
	const SortIcon = $derived(sorted === "asc" ? ArrowUpIcon : sorted === "desc" ? ArrowDownIcon : ArrowUpDownIcon);
</script>

<Table.Head
	colspan={header.colSpan}
	style={`width: ${header.getSize()}px; min-width:${header.column.columnDef.minSize}px; max-width:${header.column.columnDef.maxSize}px`}
>
	{#if !header.isPlaceholder}
		{#if header.column.getCanSort()}
			<Button
				variant="ghost"
				size="sm"
				class="data-[state=open]:bg-accent -ml-3 h-8"
				onclick={header.column.getToggleSortingHandler()}
			>
				<FlexRender {header} />
				<SortIcon class="ml-2" />
			</Button>
		{:else}
			<span class="text-sm font-medium">
				<FlexRender {header} />
			</span>
		{/if}
	{/if}
</Table.Head>
