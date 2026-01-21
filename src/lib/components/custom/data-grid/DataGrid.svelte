<script lang="ts" generics="T">
	import { type Table as TableType } from "@tanstack/table-core";
	import { FlexRender } from "$lib/components/ui/data-table";
	import { Skeleton, Table } from "$lib/components/ui";
	import Pagination from "./Pagination.svelte";
	import { type Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { ProgressLoading } from "../progress-loading";
	import { cn } from "$lib/utils";
	import DataGridHeader from "./DataGridHeader.svelte";
	import DataGridFooter from "./DataGridFooter.svelte";
	import { defaultDataGridProps, type DataGridProps } from "./types";
	import DataGridView from "./DataGridView.svelte";

	interface Props<T> {
		table: TableType<T>;
		dataGridProps?: DataGridProps;
		isLoading?: boolean;
		header?: Snippet;
		subHeader?: Snippet;
		footer?: Snippet;
		leftToolbar?: Snippet;
		rightToolbar?: Snippet;
		noDataMessage?: string;
		hideHeader?: boolean;
		enableVisibility?: boolean;
		class?: string;
		headerClass?: string;
		disableUISorting?: boolean;
	}

	let {
		table,
		dataGridProps = defaultDataGridProps,
		isLoading = false,
		header,
		subHeader,
		footer,
		leftToolbar,
		rightToolbar,
		noDataMessage = "No data",
		hideHeader = false,
		enableVisibility = false,
		class: className,
		headerClass,
		disableUISorting = false,
	}: Props<T> = $props();

	let end: HTMLElement | undefined = $state();

	const tableState = $derived(table.getState());
	const columnVisibility = $derived(tableState.columnVisibility);
</script>

<div class={cn("w-full", className)}>
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
						<DataGridView {table} />
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="rounded-md border">
		{#if isLoading}
			<span in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1" />
			</span>
		{/if}

		{#if subHeader}
			{@render subHeader()}
		{/if}

		<Table.Root class="table-auto">
			{#if !hideHeader}
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row>
							{#each headerGroup.headers.filter((h) => columnVisibility[h.column.id] !== false) as header (header.id)}
								<DataGridHeader {header} {table} {disableUISorting} />
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
			{/if}

			<Table.Body>
				{#if isLoading && table.getRowModel().rows.length == 0}
					{#each { length: 5 }}
						<Table.Row>
							{#each table.getAllColumns() as _cell (_cell.id)}
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
								<div class="text-center">{noDataMessage}</div>
							</Table.Cell>
						</Table.Row>
					{/if}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell
									class={cell.column.columnDef.meta?.className}
									style={`width: ${cell.column.getSize()}px; min-width:${cell.column.columnDef.minSize}px; max-width:${cell.column.columnDef.maxSize}px`}
								>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
			<DataGridFooter {table} />
		</Table.Root>
		{#if isLoading}
			<span in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1" />
			</span>
		{/if}
	</div>
	{#if dataGridProps.isPaginationEnabled}
		<Pagination {table} {dataGridProps} />
	{/if}

	{#if footer}
		<div class="overflow-hidden rounded-b-md">
			{@render footer()}
		</div>
	{/if}
</div>

<div bind:this={end} aria-hidden="true"></div>
