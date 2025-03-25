<script lang="ts" generics="T">
	import { type ColumnDef, type Table as TableType } from "@tanstack/table-core";
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
	import DataTableHeader from "./DataTableHeader.svelte";
	import type { ShadTable } from "./shad-table.svelte";

	interface Props<T> {
		tableState: ShadTable<T>;
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
		class?: string;
		headerClass?: string;
		disableUISorting?: boolean;
	}

	let {
		tableState = $bindable(),
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
		class: className,
		headerClass,
		disableUISorting = false,
	}: Props<T> = $props();

	const isPaginationEnabled = tableState.table.options.getPaginationRowModel !== undefined;
	const enableRowSelection = tableState.table.options.enableRowSelection;

	if (enableRowSelection) {
		const rowSelectionColumn: ColumnDef<T> = {
			id: "select",
			// cell: (info) => "[]",
			header: () =>
				renderComponent(DataTableCheckbox, {
					checked: tableState.table.getIsAllPageRowsSelected(),
					onCheckedChange: () => tableState.table.toggleAllPageRowsSelected(),
				}),
			cell: (r) =>
				renderComponent(DataTableCheckbox, {
					checked: r.row.getIsSelected(),
					onCheckedChange: () => r.row.toggleSelected(),
				}),
			enableResizing: false,
			enableSorting: false,
		};
		tableState.columns.unshift(rowSelectionColumn);
	}
</script>

<div
	class={cn(
		"w-full",
		tableStore.isFullscreen ? "bg-background absolute top-0 left-0 z-10 h-screen transition-all" : "w-full",
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
							<VisibilitySelect bind:tableState />
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
					{#each tableState.table.getHeaderGroups() as headerGroup, headerGroupIndex}
						<Table.Row>
							{#each headerGroup.headers as header, headerIndex}
								<DataTableHeader {headerGroupIndex} {headerIndex} bind:tableState {disableUISorting} />
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
			{/if}

			<Table.Body>
				{#if isLoading && tableState.table.getRowModel().rows.length == 0}
					{#each { length: 5 } as _, i}
						<Table.Row>
							{#each tableState.columns as _cell}
								<Table.Cell>
									<Skeleton class="h-4" />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					{#if tableState.table.getRowModel().rows.length == 0}
						<Table.Row>
							<Table.Cell colspan={tableState.table.getAllColumns().length}>
								<div class="text-center">{noDataMessage}</div>
							</Table.Cell>
						</Table.Row>
					{/if}
					{#each tableState.table.getRowModel().rows as row}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell}
								<Table.Cell
									style={`width: ${cell.column.getSize()}px; min-width:${cell.column.columnDef.minSize}px; max-width:${cell.column.columnDef.maxSize}px`}
								>
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
		<Pagination bind:tableState />
	{/if}

	{#if footer}
		<div class="overflow-hidden rounded-b-md">
			{@render footer()}
		</div>
	{/if}
</div>
