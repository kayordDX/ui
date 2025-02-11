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
	enableVisibility?: boolean;
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
				if (options.state?.sorting) {
					options.state.sorting = updater(options.state.sorting);
				} else if (state.value.sorting) {
					state.value.sorting = updater(state.value.sorting);
				}
			} else {
				if (options.state?.sorting) {
					options.state.sorting = updater;
				} else {
					state.value.sorting = updater;
				}
			}
		};
	}

	// Paging
	if ((options.enablePaging ?? true) && !options.getPaginationRowModel) {
		options.getPaginationRowModel = getPaginationRowModel();
		options.onPaginationChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.pagination) {
					options.state.pagination = updater(options.state.pagination);
				} else if (state.value.pagination) {
					state.value.pagination = updater(state.value.pagination);
				}
			} else {
				if (options.state?.pagination) {
					options.state.pagination = updater;
				} else {
					state.value.pagination = updater;
				}
			}
		};
	}

	// Row Selection
	if ((options.enableRowSelection ?? true) && !options.onRowSelectionChange) {
		options.onRowSelectionChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.rowSelection) {
					options.state.rowSelection = updater(options.state.rowSelection);
				} else if (state.value.rowSelection) {
					state.value.rowSelection = updater(state.value.rowSelection);
				}
			} else {
				if (options.state?.rowSelection) {
					options.state.rowSelection = updater;
				} else {
					state.value.rowSelection = updater;
				}
			}
		};
	}

	// Column Visibility
	if ((options.enableVisibility ?? false) && !options.onColumnVisibilityChange) {
		options.onColumnVisibilityChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.columnVisibility) {
					options.state.columnVisibility = updater(options.state.columnVisibility);
				} else if (state.value.columnVisibility) {
					state.value.columnVisibility = updater(state.value.columnVisibility);
				}
			} else {
				if (options.state?.columnVisibility) {
					options.state.columnVisibility = updater;
				} else {
					state.value.columnVisibility = updater;
				}
			}
		};
	}

	options.state = state.value;

	const tableOptions = options as unknown as TableOptions<TData>;
	return createSvelteTable(tableOptions);
};
