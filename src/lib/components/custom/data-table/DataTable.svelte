<script lang="ts" generics="T">
	import { type Table as TableType } from "@tanstack/table-core";
	import { FlexRender } from "$lib/components/ui/data-table";
	import { Skeleton, Table } from "$lib/components/ui";
	import Pagination from "./Pagination.svelte";
	import { onMount, untrack, type Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { ProgressLoading } from "../progress-loading";
	import FullscreenModeToggle from "./FullscreenModeToggle.svelte";
	import { cn } from "$lib/utils";
	import { TableStore } from "./table.svelte";
	import DataTableHeader from "./DataTableHeader.svelte";
	import DataTableFooter from "./DataTableFooter.svelte";
	import { beforeNavigate } from "$app/navigation";
	import { decodeColumnFilters, decodeSorting, encodeColumnFilters, encodeSorting } from "./table-search-params";
	import { useSearchParams } from "runed/kit";
	import { defaultSearchParamSchema } from "./types";
	import DataTableView from "./DataTableView.svelte";

	interface Props<T> {
		table: TableType<T>;
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
		table,
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

	const tableStore = new TableStore();
	// svelte-ignore state_referenced_locally
	const isPaginationEnabled = table.options.getPaginationRowModel !== undefined;

	const params = useSearchParams(defaultSearchParamSchema, { pushHistory: false });
	// Load current url search params
	onMount(() => {
		if (table.options.useURLSearchParams) {
			table.setGlobalFilter(params.search);
			table.setSorting(decodeSorting() ?? []);
			table.setPageIndex(params.page);
			table.setColumnFilters(decodeColumnFilters() ?? []);
		}
	});

	// Reset pageIndex
	beforeNavigate((navigation) => {
		if (table.options.useURLSearchParams) {
			if (Number(navigation.to?.url.searchParams.get("page") ?? "0") > 0) {
				if (
					navigation.from?.url.searchParams.get("sort") != navigation.to?.url.searchParams.get("sort") ||
					navigation.from?.url.searchParams.get("search") != navigation.to?.url.searchParams.get("search") ||
					navigation.from?.url.searchParams.get("filter") != navigation.to?.url.searchParams.get("filter")
				) {
					table.resetPageIndex();
				}
			}
		}
	});

	// Set url search params
	$effect(() => {
		if (table.options.useURLSearchParams) {
			const search = table.getState().globalFilter;
			const page = table.getState().pagination.pageIndex;
			const sort = encodeSorting(table.getState());
			const filter = encodeColumnFilters(table.getState());
			untrack(() => {
				params.search = search;
				params.page = page;
				params.sort = sort;
				params.filter = filter;
			});
		}
	});

	let end: HTMLElement | undefined = $state();
</script>

<div
	class={cn(
		"w-full",
		tableStore.isFullscreen
			? "bg-background b-0 absolute inset-0 top-0 left-0 z-20 overflow-auto  p-2 transition-all"
			: "w-full",
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
					{#each table.getHeaderGroups() as headerGroup (headerGroup)}
						<Table.Row>
							{#each headerGroup.headers as header (header)}
								<DataTableHeader {header} {table} {disableUISorting} />
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
								<div class="text-center">{noDataMessage}</div>
							</Table.Cell>
						</Table.Row>
					{/if}
					{#each table.getRowModel().rows as row (row)}
						<Table.Row data-state={row.getIsSelected() && "selected"}>
							{#each row.getVisibleCells() as cell (cell)}
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
			<DataTableFooter {table} />
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

<div bind:this={end} aria-hidden="true"></div>
