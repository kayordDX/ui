<script lang="ts" generics="T extends RowData">
	import type { RowData, Table } from "@tanstack/svelte-table";
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import ChevronsLeft from "@lucide/svelte/icons/chevrons-left";
	import ChevronsRight from "@lucide/svelte/icons/chevrons-right";
	import { Select, Button } from "$lib";
	import type { DataTableFeatures } from "./features";

	interface Props<T extends RowData> {
		table: Table<DataTableFeatures, T>;
		canChangePageSize?: boolean;
	}

	let { table, canChangePageSize = true }: Props<T> = $props();

	const pagination = $derived(table.atoms.pagination.get());
</script>

<div class="flex items-center justify-between gap-4 px-2 py-4">
	<div class="text-muted-foreground flex-1 text-sm">
		{#if table.options.enableRowSelection}
			<p>
				{table.getFilteredSelectedRowModel().rows.length} of
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</p>
		{/if}
		<p>
			{#if !table.options.manualPagination}
				{table.getPrePaginatedRowModel().rows.length.toLocaleString()}
				of {table.options.data.length.toLocaleString()} rows
			{/if}
		</p>
	</div>
	<div class="flex items-center gap-6 lg:gap-8">
		{#if canChangePageSize}
			<div class="flex items-center gap-2">
				<p class="text-sm font-medium">Rows per page</p>
				<!-- bits-ui's Select has no SelectValue part — the trigger renders the
					selected value directly as its children. -->
				<Select.Root
					type="single"
					value={`${pagination.pageSize}`}
					onValueChange={(value) => table.setPageSize(Number(value))}
				>
					<Select.Trigger size="sm" class="w-[70px]">
						{pagination.pageSize === Infinity ? "All" : pagination.pageSize}
					</Select.Trigger>
					<Select.Content side="top">
						{#each [10, 20, 30, 40, 50, Infinity] as pageSize (pageSize)}
							<Select.Item value={`${pageSize}`} label={pageSize === Infinity ? "All" : `${pageSize}`} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		{/if}
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			Page {pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
		</div>
		<div class="flex items-center gap-2">
			<Button
				variant="outline"
				size="icon"
				class="hidden size-8 lg:flex"
				disabled={!table.getCanPreviousPage()}
				onclick={() => table.firstPage()}
			>
				<span class="sr-only">Go to first page</span>
				<ChevronsLeft />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				disabled={!table.getCanPreviousPage()}
				onclick={() => table.previousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeft />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="size-8"
				disabled={!table.getCanNextPage()}
				onclick={() => table.nextPage()}
			>
				<span class="sr-only">Go to next page</span>
				<ChevronRight />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="hidden size-8 lg:flex"
				disabled={!table.getCanLastPage()}
				onclick={() => table.lastPage()}
			>
				<span class="sr-only">Go to last page</span>
				<ChevronsRight />
			</Button>
		</div>
	</div>
</div>
