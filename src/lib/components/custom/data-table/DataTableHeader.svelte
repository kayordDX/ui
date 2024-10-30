<script lang="ts" generics="T">
	import { Button, FlexRender, Input, Popover, Table } from "$lib";
	import { type Header, type Table as TypeType } from "@tanstack/table-core";
	import { ArrowUpDownIcon, ArrowDownIcon, ArrowUpIcon, XIcon, FilterIcon } from "lucide-svelte";

	interface Props<T> {
		header: Header<T, unknown>;
		table: TypeType<T>;
	}

	let { header, table }: Props<T> = $props();

	const isSortingEnabled = $derived(table.options.getSortedRowModel !== undefined);
	const isFilteringEnabled = table.options.getFilteredRowModel !== undefined;
</script>

<Table.Head colspan={header.colSpan}>
	{#if !header.isPlaceholder}
		<div class="flex items-center gap-1">
			<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
			{#if isFilteringEnabled}
				<Popover.Root>
					<Popover.Trigger>
						<FilterIcon class="size-3" />
					</Popover.Trigger>
					<Popover.Content>
						<div class="flex items-center">
							<Input
								type="text"
								value={header.column.getFilterValue()}
								onchange={(e) => header.column.setFilterValue(e.currentTarget.value)}
								oninput={(e) => header.column.setFilterValue(e.currentTarget.value)}
							/>
							<Popover.Close onclick={() => header.column.setFilterValue(undefined)} class="fixed right-6">
								<XIcon class="size-4" />
							</Popover.Close>
						</div>
					</Popover.Content>
				</Popover.Root>
			{/if}
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
