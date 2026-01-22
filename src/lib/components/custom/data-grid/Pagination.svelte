<script lang="ts" generics="T">
	import type { Table } from "@tanstack/table-core";
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import DoubleArrowLeft from "@lucide/svelte/icons/arrow-left";
	import DoubleArrowRight from "@lucide/svelte/icons/arrow-right";
	import { Select, Button } from "$lib";

	interface Props<T> {
		table: Table<T>;
		enableRowSelectionUI?: boolean;
		canChangePageSize?: boolean;
	}

	let { table, enableRowSelectionUI, canChangePageSize = false }: Props<T> = $props();

	// svelte-ignore state_referenced_locally
	let value = $state(table.getState().pagination.pageSize.toString());
</script>

<div class="flex items-center justify-between py-2">
	<div class="text-muted-foreground flex-1 text-sm">
		{#if enableRowSelectionUI}
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		{/if}
	</div>
	<div class="flex items-center space-x-6 lg:space-x-8">
		<div class="flex items-center space-x-2">
			{#if canChangePageSize}
				<p class="text-sm font-medium">Page size</p>
				<Select.Root
					type="single"
					bind:value
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<Select.Trigger class="h-8 w-20">Rows</Select.Trigger>
					<Select.Content side="top">
						{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
							<Select.Item value={pageSize.toString()}>
								{pageSize}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			{/if}
		</div>
		<div class="flex w-25 items-center justify-center text-sm font-medium">
			Page {table.getState().pagination.pageIndex + 1} of
			{table.getPageCount()}
		</div>
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				onclick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to first page</span>
				<DoubleArrowLeft class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeft class="size-4" />
			</Button>
			<Button variant="outline" class="size-8 p-0" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
				<span class="sr-only">Go to next page</span>
				<ChevronRight class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				onclick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Go to last page</span>
				<DoubleArrowRight class="size-4" />
			</Button>
		</div>
	</div>
</div>
