<script lang="ts" generics="T">
	import { FlexRender, type ColumnDef, type Table as TypeType } from "@tanstack/svelte-table";
	import { Skeleton, Table } from "$lib/components/ui";
	import Pagination from "./Pagination.svelte";
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { ProgressLoading } from "../progress-loading";

	interface Props<T> {
		table: TypeType<T>;
		columns: ColumnDef<T>[];
		isLoading?: boolean;
		header?: Snippet;
		subHeader?: Snippet;
		footer?: Snippet;
		title?: string;
		noDataMessage?: string;
		enablePagination?: boolean;
	}

	let {
		table,
		columns,
		isLoading = false,
		header,
		subHeader,
		footer,
		title,
		noDataMessage = "No data",
		enablePagination = true,
	}: Props<T> = $props();

	console.log(table.getState().pagination);
</script>

<div class="w-full">
	<div class="rounded-md border">
		{#if isLoading}
			<span in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1" />
			</span>
		{:else}
			<div class="h-1"></div>
		{/if}
		{#if header || (title?.length ?? 0) > 0}
			<div class="overflow-hidden rounded-t-md">
				{#if header}
					{@render header()}
				{:else}
					<h1 class="p-2 text-center text-lg">
						{title}
					</h1>
				{/if}
			</div>
		{/if}
		{#if subHeader}
			{@render subHeader()}
		{/if}
		<Table.Root class="table-auto">
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup}
					<Table.Row>
						{#each headerGroup.headers as header}
							<Table.Head colspan={header.colSpan}>
								{#if !header.isPlaceholder}
									<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if isLoading && table.getRowModel().rows.length == 0}
					{#each { length: 5 } as _, i}
						<Table.Row>
							{#each columns as _cell}
								<Table.Cell>
									<Skeleton class="h-4" />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					{#if table.getRowModel().rows.length == 0}
						<Table.Row>
							<Table.Cell colspan={table.getRowModel().rows.length}>
								<div class="text-center">{noDataMessage}</div>
							</Table.Cell>
						</Table.Row>
					{/if}
					{#each table.getRowModel().rows as row}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
		{#if isLoading}
			<span in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1" />
			</span>
		{/if}
	</div>
	{#if enablePagination}
		<Pagination {table} />
	{/if}

	{#if footer}
		<div class="overflow-hidden rounded-b-md">
			{@render footer()}
		</div>
	{/if}
</div>
