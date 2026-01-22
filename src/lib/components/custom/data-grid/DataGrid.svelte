<script lang="ts" generics="T">
	import { FlexRender } from "$lib/components/ui/data-table";
	import { Skeleton, Table } from "$lib/components/ui";
	import Pagination from "./Pagination.svelte";
	import { onMount } from "svelte";
	import { fade } from "svelte/transition";
	import { ProgressLoading } from "../progress-loading";
	import { cn } from "$lib/utils";
	import DataGridHeader from "./DataGridHeader.svelte";
	import DataGridFooter from "./DataGridFooter.svelte";
	import { defaultSearchParamSchema, defaultTableProps, type DataGrid } from "./types";
	import DataGridView from "./DataGridView.svelte";
	import { useSearchParams } from "runed/kit";
	import { untrack } from "svelte";
	import { decodeColumnFilters, decodeSorting, encodeColumnFilters, encodeSorting } from "../data-table";
	import { createGrid } from "./createGrid.svelte";

	let {
		table = $bindable(),
		columns,
		data,
		isLoading = false,
		noDataMessage = "No data",
		class: className,
		headerClass,
		tableProps = defaultTableProps,
		snippets = {},
		uiConfig = {},
	}: DataGrid<T> = $props();

	table = createGrid({
		columns: () => columns,
		data: () => data,
		tableProps: () => tableProps,
	});

	let ending = $state<HTMLElement | undefined>();

	const tableState = $derived(table.getState());
	const columnVisibility = $derived(tableState.columnVisibility);

	const params = useSearchParams(defaultSearchParamSchema, { pushHistory: false });

	const config = $derived({ ...defaultTableProps, ...(tableProps ?? {}) });

	// Load current url search params
	onMount(() => {
		if (config.useURLSearchParams) {
			table.setGlobalFilter(params.search);
			table.setSorting(decodeSorting() ?? []);
			table.setPageIndex(params.page);
			table.setColumnFilters(decodeColumnFilters() ?? []);
		}
	});

	// Set url search params
	$effect(() => {
		if (config.useURLSearchParams) {
			const tableState = table.getState();
			untrack(() => {
				params.search = tableState.globalFilter;
				params.page = tableState.pagination.pageIndex;
				params.sort = encodeSorting(tableState);
				params.filter = encodeColumnFilters(tableState);
			});
		}
	});
</script>

<div class={cn("w-full", className)}>
	<div class={cn(headerClass)}>
		{#if snippets.header}
			{@render snippets.header()}
		{:else}
			<div class="flex items-center justify-between gap-2 pb-2">
				<div>
					{#if snippets.leftToolbar}
						{@render snippets.leftToolbar()}
					{/if}
				</div>
				<div></div>
				<div class="flex items-center justify-between gap-2">
					{#if snippets.rightToolbar}
						{@render snippets.rightToolbar()}
					{/if}
					{#if uiConfig.enableVisibility}
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

		{#if snippets.subHeader}
			{@render snippets.subHeader()}
		{/if}

		<Table.Root class="table-auto">
			{#if !uiConfig.hideHeader}
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row>
							{#each headerGroup.headers.filter((h) => columnVisibility[h.column.id] !== false) as header (header.id)}
								<DataGridHeader {header} {table} disableUISorting={uiConfig.disableUISorting} />
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
	{#if config.isPaginationEnabled ?? true}
		<Pagination {table} enableRowSelectionUI={config.enableRowSelectionUI} />
	{/if}

	{#if snippets.footer}
		<div class="overflow-hidden rounded-b-md">
			{@render snippets.footer()}
		</div>
	{/if}
</div>

<div bind:this={ending} aria-hidden="true"></div>
