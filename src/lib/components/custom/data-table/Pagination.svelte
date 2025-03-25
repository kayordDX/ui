<script lang="ts" generics="T">
	import type { Table } from "@tanstack/table-core";
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import DoubleArrowLeft from "@lucide/svelte/icons/arrow-left";
	import DoubleArrowRight from "@lucide/svelte/icons/arrow-right";
	import { Select, Button } from "$lib";
	import type { ShadTable } from "./shad-table.svelte";

	interface Props<T> {
		tableState: ShadTable<T>;
		canChangePageSize?: boolean;
	}

	let { tableState = $bindable(), canChangePageSize = false }: Props<T> = $props();

	let value = $state(tableState.table.getState().pagination.pageSize.toString());
</script>

<div class="flex items-center justify-between py-2">
	<div class="text-muted-foreground flex-1 text-sm">
		{#if tableState.table.options.enableRowSelection}
			{tableState.table.getFilteredSelectedRowModel().rows.length} of
			{tableState.table.getFilteredRowModel().rows.length} row(s) selected.
		{/if}
	</div>
	<div class="flex items-center space-x-6 lg:space-x-8">
		<div class="flex items-center space-x-2">
			{#if canChangePageSize}
				<p class="text-sm font-medium">Rows per page</p>
				<Select.Root
					type="single"
					bind:value
					onValueChange={(value) => {
						tableState.table.setPageSize(Number(value));
					}}
				>
					<Select.Trigger class="h-8 w-[70px]">Select page size</Select.Trigger>
					<Select.Content side="top">
						{#each [10, 20, 30, 40, 50] as pageSize}
							<Select.Item value={pageSize.toString()}>
								{pageSize}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/if}
		</div>
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			Page {tableState.table.getState().pagination.pageIndex + 1} of
			{tableState.table.getPageCount()}
		</div>
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				onclick={() => tableState.table.setPageIndex(0)}
				disabled={!tableState.table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to first page</span>
				<DoubleArrowLeft class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => tableState.table.previousPage()}
				disabled={!tableState.table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeft class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => tableState.table.nextPage()}
				disabled={!tableState.table.getCanNextPage()}
			>
				<span class="sr-only">Go to next page</span>
				<ChevronRight class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				onclick={() => tableState.table.setPageIndex(tableState.table.getPageCount() - 1)}
				disabled={!tableState.table.getCanNextPage()}
			>
				<span class="sr-only">Go to last page</span>
				<DoubleArrowRight class="size-4" />
			</Button>
		</div>
	</div>
</div>
