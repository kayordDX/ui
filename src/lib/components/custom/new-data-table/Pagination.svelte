<script lang="ts" generics="T">
	import type { Table } from "@tanstack/svelte-table";
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import DoubleArrowLeft from "lucide-svelte/icons/arrow-left";
	import DoubleArrowRight from "lucide-svelte/icons/arrow-right";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	interface Props<T> {
		table: Table<T>;
	}

	let { table }: Props<T> = $props();
</script>

<div class="flex items-center justify-between p-2">
	<div class="flex-1 text-sm text-muted-foreground">
		{table.getFilteredSelectedRowModel().rows.length} of
		{table.getFilteredRowModel().rows.length} row(s) selected.
	</div>
	<div class="flex items-center space-x-6 lg:space-x-8">
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium">Rows per page</p>
			<Select.Root
				selected={{
					value: table.getState().pagination.pageSize,
					label: `${table.getState().pagination.pageSize}`,
				}}
				onSelectedChange={(selected) => {
					table.setPageSize(Number(selected?.value));
				}}
			>
				<Select.Trigger class="h-8 w-[70px]">
					<Select.Value placeholder="Select page size" />
				</Select.Trigger>
				<Select.Content side="top">
					{#each [10, 20, 30, 40, 50] as pageSize}
						<Select.Item value={pageSize}>
							{pageSize}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			Page {table.getState().pagination.pageIndex + 1} of
			{table.getPageCount()}
		</div>
		<div class="flex items-center space-x-2">
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				on:click={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to first page</span>
				<DoubleArrowLeft class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="size-8 p-0"
				on:click={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ChevronLeft class="size-4" />
			</Button>
			<Button variant="outline" class="size-8 p-0" on:click={() => table.nextPage()} disabled={!table.getCanNextPage()}>
				<span class="sr-only">Go to next page</span>
				<ChevronRight class="size-4" />
			</Button>
			<Button
				variant="outline"
				class="hidden size-8 p-0 lg:flex"
				on:click={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				<span class="sr-only">Go to last page</span>
				<DoubleArrowRight class="size-4" />
			</Button>
		</div>
	</div>
</div>
