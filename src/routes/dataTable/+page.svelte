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
		type ColumnSizingState,
	} from "@tanstack/table-core";

	import { createSvelteTable as createTable } from "$lib/components/ui/data-table";
	import { getData } from "../dataTable/data";
	import { DataTable } from "$lib";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			cell: (info) => info.getValue(),
			maxSize: 10,
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

	const data = getData();

	const table = createTable({
		columns,
		data,
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
		enableRowSelection: false,
	});
</script>

<div class="m-4">
	<DataTable {table} {columns} enableVisibility enableFullscreen />
</div>
