<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import {
		type ColumnDef,
		getCoreRowModel,
		type VisibilityState,
		type Updater,
		type PaginationState,
		type SortingState,
		type RowSelectionState,
		type ColumnFiltersState,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel,
	} from "@tanstack/table-core";

	import { data } from "./data.svelte";
	import { DataTable, createShadTable, renderSnippet } from "$lib";
	import { aggregationFns } from "$lib/components/custom/data-table/data-table-utils";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			maxSize: 10,
			footer: () => aggregationFns.sum(data.value, "id"),
		},
		{
			accessorKey: "name",
			cell: (info) => info.getValue(),
			size: 100000,
		},
		{
			header: "Day",
			accessorKey: "day",
			size: 100,
			minSize: 150,
		},
	];

	let columnVisibility: VisibilityState = $state({});
	const setVisibility = (updater: Updater<VisibilityState>) => {
		if (updater instanceof Function) {
			columnVisibility = updater(columnVisibility);
		} else columnVisibility = updater;
	};

	let rowSelection: RowSelectionState = $state({});
	const setRowSelection = (updater: Updater<RowSelectionState>) => {
		if (updater instanceof Function) {
			rowSelection = updater(rowSelection);
		} else rowSelection = updater;
	};

	let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	const table = createShadTable({
		columns,
		data: data.value,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === "function") {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === "function") {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		getFilteredRowModel: getFilteredRowModel(),
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get columnFilters() {
				return columnFilters;
			},
		},
		onColumnVisibilityChange: setVisibility,
		onRowSelectionChange: setRowSelection,
		enableRowSelection: true,
	});
</script>

<DataTable {table} enableVisibility enableFullscreen headerClass="mt-2" />
