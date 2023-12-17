<script lang="ts">
	import { writable } from "svelte/store";
	import { createSvelteTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/svelte-table";
	import type { ColumnDef, TableOptions, SortingState, OnChangeFn, PaginationState } from "@tanstack/svelte-table";
	import { Table } from "$lib";
	import DataTableFooter from "./DataTableFooter.svelte";
	import DataTablePagination from "./DataTablePagination.svelte";
	import DataTableHeader from "./DataTableHeader.svelte";
	import DataTableBody from "./DataTableBody.svelte";

	type MRT_RowData = Record<string, any>;
	type T = $$Generic<MRT_RowData>;

	export let columns: ColumnDef<T>[] | ColumnDef<T, any>[];
	export let data: T[];

	export let title: string = "";
	export let isLoading: boolean = false;

	export let enablePagination: boolean = true;
	export let manualPagination: boolean = false;
	export let pageCount: number = 0;
	export let rowCount: number = 0;

	export let onPaginationChange: OnChangeFn<PaginationState> | undefined = undefined;

	let sorting: SortingState = [];

	const setSorting = (updater: any) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting,
			},
		}));
		return sorting;
	};

	const options = writable<TableOptions<T>>({
		data,
		columns,
		state: {
			sorting,
			pagination: {
				pageIndex: 0,
				pageSize: 10,
			},
		},
		onSortingChange: setSorting,
		onPaginationChange: onPaginationChange,
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		manualPagination: manualPagination,
		pageCount: 2,
		debugTable: false,
	});

	const table = createSvelteTable(options);
</script>

<div class="rounded-md border m-2">
	{#if $$slots.header || title.length > 0}
		<div class="rounded-t-md overflow-hidden">
			{#if $$slots.header}
				<slot name="header" />
			{:else}
				<h1 class="text-lg text-center p-2">
					{title}
				</h1>
			{/if}
		</div>
	{/if}
	{#if $$slots.subHeader}
		<slot name="subHeader" />
	{/if}
	<Table.Root class="table-auto">
		<DataTableHeader {table} />
		<DataTableBody {table} {isLoading} />
		<DataTableFooter {table} />
	</Table.Root>
	<DataTablePagination {table} {isLoading} {enablePagination} {manualPagination} {pageCount} {rowCount} />
	{#if $$slots.footer}
		<div class="rounded-b-md overflow-hidden">
			<slot name="footer" />
		</div>
	{/if}
</div>
