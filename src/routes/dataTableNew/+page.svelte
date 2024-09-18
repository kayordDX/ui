<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import {
		type ColumnDef,
		createTable,
		getCoreRowModel,
		type VisibilityState,
		type Updater,
		type PaginationState,
		type RowSelectionState,
		getPaginationRowModel,
	} from "@tanstack/svelte-table";
	import { getData } from "./data";
	import DataTable from "$lib/components/custom/data-table-new/DataTable.svelte";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			cell: (info) => info.getValue(),
		},
		{
			accessorKey: "name",
			cell: (info) => info.getValue(),
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
	const setPagination = (updater: Updater<PaginationState>) => {
		if (updater instanceof Function) {
			pagination = updater(pagination);
		} else pagination = updater;
	};

	const data = getData();

	const table = createTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			get pagination() {
				return pagination;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnVisibility() {
				return columnVisibility;
			},
		},
		onColumnVisibilityChange: setVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: setPagination,
		enableRowSelection: true,
	});
</script>

<div class="m-4">
	<DataTable {table} {columns} enableVisibility enableFullscreen />
</div>
