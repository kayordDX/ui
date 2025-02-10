import { createSvelteTable } from "$lib/components/ui";
import {
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type RowData,
	type RowModel,
	type Table,
	type TableOptions,
} from "@tanstack/table-core";
import { State } from "./state.svelte";

interface ShadTableOptions<TData extends RowData> extends Omit<TableOptions<TData>, "getCoreRowModel"> {
	getCoreRowModel?: (table: Table<any>) => () => RowModel<any>;
	enablePaging?: boolean;
}

export const createShadTable = <TData extends RowData>(options: ShadTableOptions<TData>) => {
	// Set the default getCoreRowModel
	if (!options.getCoreRowModel) {
		options.getCoreRowModel = getCoreRowModel();
	}

	const state = new State(options.state ?? {});

	// Sorting
	if ((options.enableSorting ?? true) && !options.getSortedRowModel) {
		options.getSortedRowModel = getSortedRowModel();
		options.onSortingChange = (updater) => {
			if (typeof updater === "function") {
				if (state.value.sorting) state.value.sorting = updater(state.value.sorting);
			} else {
				state.value.sorting = updater;
			}
		};
	}

	// Paging
	if ((options.enablePaging ?? true) && !options.getPaginationRowModel) {
		options.getPaginationRowModel = getPaginationRowModel();
		options.onPaginationChange = (updater) => {
			if (typeof updater === "function") {
				if (state.value.pagination) state.value.pagination = updater(state.value.pagination);
			} else {
				state.value.pagination = updater;
			}
		};
	}

	// Row Selection
	if ((options.enableRowSelection ?? true) && !options.onRowSelectionChange) {
		options.onRowSelectionChange = (updater) => {
			if (typeof updater === "function") {
				if (state.value.rowSelection) state.value.rowSelection = updater(state.value.rowSelection);
			} else {
				state.value.rowSelection = updater;
			}
		};
	}

	// Column Visibility
	if (!options.onColumnVisibilityChange) {
		options.onColumnVisibilityChange = (updater) => {
			if (typeof updater === "function") {
				if (state.value.columnVisibility) state.value.columnVisibility = updater(state.value.columnVisibility);
			} else {
				state.value.columnVisibility = updater;
			}
		};
	}

	options.state = state.value;

	const tableOptions = options as unknown as TableOptions<TData>;
	return createSvelteTable({
		...tableOptions,
	});
};
