<script lang="ts" generics="T">
	import { type ColumnDef, type Table as TypeType } from "@tanstack/table-core";
	import { FlexRender, renderComponent } from "$lib/components/ui/data-table";
	import { Skeleton, Table } from "$lib/components/ui";
	import Pagination from "./Pagination.svelte";
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { ProgressLoading } from "../progress-loading";
	import DataTableCheckbox from "./DataTableCheckbox.svelte";
	import VisibilitySelect from "./VisibilitySelect.svelte";
	import FullscreenModeToggle from "./FullscreenModeToggle.svelte";
	import { cn } from "$lib/utils";
	import { tableStore } from "./table.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { ArrowUpDown } from "lucide-svelte";
	import DataTableHeader from "./DataTableHeader.svelte";

	interface Props<T> {
		table: TypeType<T>;
		columns: ColumnDef<T>[];
		isLoading?: boolean;
		header?: Snippet;
		subHeader?: Snippet;
		footer?: Snippet;
		leftToolbar?: Snippet;
		rightToolbar?: Snippet;
		noDataMessage?: string;
		hideHeader?: boolean;
		enableVisibility?: boolean;
		enableFullscreen?: boolean;
	}

	let {
		table,
		columns,
		isLoading = false,
		header,
		subHeader,
		footer,
		leftToolbar,
		rightToolbar,
		noDataMessage = "No data",
		hideHeader = false,
		enableVisibility = false,
		enableFullscreen = false,
	}: Props<T> = $props();

	const isPaginationEnabled = table.options.getPaginationRowModel !== undefined;
	const enableRowSelection = table.options.enableRowSelection;

	if (enableRowSelection) {
		const rowSelectionColumn: ColumnDef<T> = {
			id: "select",
			// cell: (info) => "[]",
			header: () =>
				renderComponent(DataTableCheckbox, {
					checked: table.getIsAllPageRowsSelected(),
					onCheckedChange: () => table.toggleAllPageRowsSelected(),
				}),
			cell: (r) =>
				renderComponent(DataTableCheckbox, {
					checked: r.row.getIsSelected(),
					onCheckedChange: () => r.row.toggleSelected(),
				}),
			enableResizing: false,
		};
		columns.unshift(rowSelectionColumn);
	}
</script>

<div
	class={cn(
		"w-full",
		tableStore.isFullscreen ? "absolute left-0 top-0 z-10 h-screen bg-background transition-all" : "w-full"
	)}
>
	<div class="py-2">
		{#if header}
			{@render header()}
		{:else}
			<div class="flex items-center justify-between gap-2">
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
							<VisibilitySelect {table} />
						</div>
					{/if}
					{#if enableFullscreen}
						<div>
							<FullscreenModeToggle />
						</div>
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
					{#each table.getHeaderGroups() as headerGroup}
						<Table.Row>
							{#each headerGroup.headers as header}
								<DataTableHeader {header} {table} />
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
			{/if}

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
							<Table.Cell colspan={table.getAllColumns().length}>
								<div class="text-center">{noDataMessage}</div>
							</Table.Cell>
						</Table.Row>
					{/if}
					{#each table.getRowModel().rows as row}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell}
								<Table.Cell style={`width: ${cell.getContext().column.getSize()}px;`}>
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
	{#if isPaginationEnabled}
		<Pagination {table} />
	{/if}

	{#if footer}
		<div class="overflow-hidden rounded-b-md">
			{@render footer()}
		</div>
	{/if}
</div>
