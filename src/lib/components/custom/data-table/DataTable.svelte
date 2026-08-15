<script lang="ts" generics="T extends RowData">
	import type { RowData, Table as TableType } from "@tanstack/svelte-table";
	import type { DataTableFeatures } from "./features";
	import { FlexRender } from "$lib/components/ui/data-table";
	import { Skeleton, Table } from "$lib/components/ui";
	import Pagination from "./Pagination.svelte";
	import { type Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { ProgressLoading } from "../progress-loading";
	import FullscreenModeToggle from "./FullscreenModeToggle.svelte";
	import { cn } from "$lib/utils";
	import { TableStore } from "./table.svelte";
	import DataTableHeader from "./DataTableHeader.svelte";
	import DataTableFooter from "./DataTableFooter.svelte";
	import DataTableView from "./DataTableView.svelte";

	interface Props<T extends RowData> {
		table: TableType<DataTableFeatures, T>;
		isLoading?: boolean;
		header?: Snippet;
		subHeader?: Snippet;
		footer?: Snippet;
		leftToolbar?: Snippet;
		rightToolbar?: Snippet;
		/** Rich empty state; falls back to `noDataMessage` when not provided. */
		emptyState?: Snippet;
		noDataMessage?: string;
		hideHeader?: boolean;
		enableVisibility?: boolean;
		enableFullscreen?: boolean;
		/** Show the pagination bar (default `true`). */
		pagination?: boolean;
		disableUISorting?: boolean;
		class?: string;
		headerClass?: string;
	}

	let {
		table,
		isLoading = false,
		header,
		subHeader,
		footer,
		leftToolbar,
		rightToolbar,
		emptyState,
		noDataMessage = "No data",
		hideHeader = false,
		enableVisibility = false,
		enableFullscreen = false,
		pagination = true,
		disableUISorting = false,
		class: className,
		headerClass,
	}: Props<T> = $props();

	const tableStore = new TableStore();
	let end: HTMLElement | undefined = $state();

	function cellSizeStyle(width: number, min?: number, max?: number) {
		const styles = [`width: ${width}px`];
		if (min !== undefined) styles.push(`min-width: ${min}px`);
		if (max !== undefined) styles.push(`max-width: ${max}px`);
		return styles.join("; ");
	}
</script>

<div
	class={cn(
		"w-full",
		tableStore.isFullscreen ? "bg-background absolute inset-0 z-20 overflow-auto p-2 transition-all" : "w-full",
		className
	)}
>
	<div class={cn(headerClass)}>
		{#if header}
			{@render header()}
		{:else}
			<div class="flex items-center justify-between gap-2 pb-2">
				<div>
					{#if leftToolbar}
						{@render leftToolbar()}
					{/if}
				</div>
				<div></div>
				<div class="flex items-center justify-between gap-2">
					{#if rightToolbar}
						{@render rightToolbar()}
					{/if}
					{#if enableVisibility}
						<div>
							<DataTableView {table} />
						</div>
					{/if}
					{#if enableFullscreen}
						<div>
							<FullscreenModeToggle bind:isFullscreen={tableStore.isFullscreen} {end} />
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="relative overflow-hidden rounded-md border">
		{#if isLoading}
			<span class="absolute inset-x-0 top-0 z-10" in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1 rounded-none" />
			</span>
		{/if}

		{#if subHeader}
			{@render subHeader()}
		{/if}

		<Table.Root class="table-auto">
			{#if !hideHeader}
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup)}
						<Table.Row>
							{#each headerGroup.headers as header (header)}
								<DataTableHeader {header} {disableUISorting} />
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
			{/if}

			<Table.Body>
				{#if isLoading && table.getRowModel().rows.length == 0}
					{#each { length: 5 }, i (i)}
						<Table.Row>
							{#each table.getAllColumns() as _cell (_cell)}
								<Table.Cell>
									<Skeleton class="h-4" />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					{#if table.getRowModel().rows.length == 0}
						<Table.Row>
							<Table.Cell colspan={table.getAllColumns().length}>
								<div class="text-center">
									{#if emptyState}
										{@render emptyState()}
									{:else}
										{noDataMessage}
									{/if}
								</div>
							</Table.Cell>
						</Table.Row>
					{/if}
					{#each table.getRowModel().rows as row (row)}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell (cell)}
								<Table.Cell
									class={cell.column.columnDef.meta?.className}
									style={cellSizeStyle(
										cell.column.getSize(),
										cell.column.columnDef.minSize,
										cell.column.columnDef.maxSize
									)}
								>
									<FlexRender {cell} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
			<DataTableFooter {table} />
		</Table.Root>
		{#if isLoading}
			<span class="absolute inset-x-0 bottom-0 z-10" in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1 rounded-none" />
			</span>
		{/if}
	</div>
	{#if pagination}
		<Pagination {table} />
	{/if}

	{#if footer}
		<div class="overflow-hidden rounded-b-md">
			{@render footer()}
		</div>
	{/if}
</div>

<div bind:this={end} aria-hidden="true"></div>
