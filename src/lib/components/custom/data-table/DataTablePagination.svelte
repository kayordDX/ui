<script lang="ts">
	import { ArrowBigLeft, ArrowBigRight, ArrowLeft, ArrowRight } from "lucide-svelte";

	import type { Table as TableType } from "@tanstack/svelte-table";
	import { Button, Select, Table } from "$lib";
	import type { Readable } from "svelte/store";

	type T = $$Generic<MRT_RowData>;
	export let table: Readable<TableType<T>>;
	export let isLoading: boolean = false;
	export let enablePagination: boolean = true;
	export let manualPagination: boolean = false;
	export let pageCount: number = 0;
	export let rowCount: number = 0;
</script>

{#if enablePagination}
	<div class="flex items-center justify-between px-2 py-2">
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			Page {$table.getState().pagination.pageIndex + 1} of {$table.getPageCount()}
		</div>

		<div class="flex items-center space-x-2">
			<div class="flex items-center mr-5">
				<p class="text-sm font-medium flex break-keep w-[100px]">Rows per page</p>
				<Select.Root
					onSelectedChange={(selected) => $table.setPageSize(Number(selected?.value))}
					selected={{ value: $table.getState().pagination.pageSize.toString(), label: $table.getState().pagination.pageSize.toString() }}
				>
					<Select.Trigger class="w-[90px]">
						<Select.Value placeholder="Select page size" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="10">10</Select.Item>
						<Select.Item value="20">20</Select.Item>
						<Select.Item value="30">30</Select.Item>
						<Select.Item value="40">40</Select.Item>
						<Select.Item value="50">50</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" on:click={() => $table.setPageIndex(0)} disabled={isLoading || !$table.getCanPreviousPage()}>
				<span class="sr-only">Go to first page</span>
				<ArrowBigLeft size={15} />
			</Button>
			<Button
				variant="outline"
				class="p-0 w-8 h-8"
				on:click={() => $table.setPageIndex($table.getState().pagination.pageIndex - 1)}
				disabled={isLoading || !$table.getCanPreviousPage()}
			>
				<span class="sr-only">Go to previous page</span>
				<ArrowLeft size={15} />
			</Button>
			<Button
				variant="outline"
				class="p-0 w-8 h-8"
				disabled={isLoading || !$table.getCanNextPage()}
				on:click={() => $table.setPageIndex($table.getState().pagination.pageIndex + 1)}
			>
				<span class="sr-only">Go to next page</span>
				<ArrowRight size={15} />
			</Button>
			<Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" disabled={isLoading || !$table.getCanNextPage()} on:click={() => $table.setPageIndex($table.getPageCount() - 1)}>
				<span class="sr-only">Go to last page</span>
				<ArrowBigRight size={15} />
			</Button>
		</div>
	</div>
{/if}
