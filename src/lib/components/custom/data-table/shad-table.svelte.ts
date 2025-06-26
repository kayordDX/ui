import {
	createTable,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type ColumnDef,
	type RowData,
	type RowModel,
	type Table,
	type TableOptions,
	type TableOptionsResolved,
	type TableState,
} from "@tanstack/table-core";
import DataTableCheckbox from "./DataTableCheckbox.svelte";
import { renderComponent } from "$lib/components/ui";
import { mergeObjects } from "$lib/components/ui/data-table/data-table.svelte";

interface ShadTableOptions<TData extends RowData> extends Omit<TableOptions<TData>, "getCoreRowModel"> {
	getCoreRowModel?: (table: Table<any>) => () => RowModel<any>;
	enablePaging?: boolean;
	enableVisibility?: boolean;
	enableRowSelectionUI?: boolean;
}

export function createShadTable<TData extends RowData>(shadOptions: ShadTableOptions<TData>) {
	if (!shadOptions.getCoreRowModel) {
		shadOptions.getCoreRowModel = getCoreRowModel();
	}

	if ((shadOptions.enablePaging ?? true) == false) {
		shadOptions.manualPagination = true;
	}

	if (shadOptions.useURLSearchParams) {
		shadOptions.autoResetPageIndex = false;
	}

	const options: TableOptions<TData> = shadOptions as TableOptions<TData>;

	// Features
	// Sorting
	if ((options.enableSorting ?? true) && !options.getSortedRowModel) {
		options.getSortedRowModel = getSortedRowModel();

		if (!options.onSortingChange) {
			options.onSortingChange = (updater) => {
				if (typeof updater === "function") {
					if (options.state?.sorting) {
						options.state.sorting = updater(options.state.sorting);
					} else if (state.sorting) {
						state.sorting = updater(state.sorting);
					}
				} else {
					if (options.state?.sorting) {
						options.state.sorting = updater;
					} else {
						state.sorting = updater;
					}
				}
			};
		}
	}
	// Paging
	if ((shadOptions.enablePaging ?? true) && !options.getPaginationRowModel) {
		options.getPaginationRowModel = getPaginationRowModel();

		if (!options.onPaginationChange) {
			options.onPaginationChange = (updater) => {
				if (typeof updater === "function") {
					if (options.state?.pagination) {
						options.state.pagination = updater(options.state.pagination);
					} else if (state.pagination) {
						state.pagination = updater(state.pagination);
					}
				} else {
					if (options.state?.pagination) {
						options.state.pagination = updater;
					} else {
						state.pagination = updater;
					}
				}
			};
		}
	}

	// Row Selection
	if ((options.enableRowSelection ?? true) && !options.onRowSelectionChange) {
		options.onRowSelectionChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.rowSelection) {
					options.state.rowSelection = updater(options.state.rowSelection);
				} else if (state.rowSelection) {
					state.rowSelection = updater(state.rowSelection);
				}
			} else {
				if (options.state?.rowSelection) {
					options.state.rowSelection = updater;
				} else {
					state.rowSelection = updater;
				}
			}
		};
	}

	if (options.enableRowSelection && (shadOptions.enableRowSelectionUI ?? true)) {
		const rowSelectionColumn: ColumnDef<TData> = {
			id: "select",
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
			enableSorting: false,
		};
		options.columns.unshift(rowSelectionColumn);
	}

	// Column Visibility
	if ((shadOptions.enableVisibility ?? false) && !options.onColumnVisibilityChange) {
		options.onColumnVisibilityChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.columnVisibility) {
					options.state.columnVisibility = updater(options.state.columnVisibility);
				} else if (state.columnVisibility) {
					state.columnVisibility = updater(state.columnVisibility);
				}
			} else {
				if (options.state?.columnVisibility) {
					options.state.columnVisibility = updater;
				} else {
					state.columnVisibility = updater;
				}
			}
		};
	}

	// Filtering
	if ((options.enableFilters ?? true) && !options.getFilteredRowModel) {
		options.getFilteredRowModel = getFilteredRowModel();

		// Global Filtering
		if (options.enableGlobalFilter ?? false) {
			if (!options.onGlobalFilterChange) {
				options.onGlobalFilterChange = (updater) => {
					if (typeof updater === "function") {
						if (options.state?.globalFilter) {
							options.state.globalFilter = updater(options.state.globalFilter);
						} else if (state.globalFilter) {
							state.globalFilter = updater(state.globalFilter);
						}
					} else {
						if (options.state?.globalFilter) {
							options.state.globalFilter = updater;
						} else {
							state.globalFilter = updater;
						}
					}
				};
			}
		} else {
			if (!options.onColumnFiltersChange) {
				options.onColumnFiltersChange = (updater) => {
					if (typeof updater === "function") {
						if (options.state?.columnFilters) {
							options.state.columnFilters = updater(options.state.columnFilters);
						} else if (state.columnFilters) {
							state.columnFilters = updater(state.columnFilters);
						}
					} else {
						if (options.state?.columnFilters) {
							options.state.columnFilters = updater;
						} else {
							state.columnFilters = updater;
						}
					}
				};
			}
		}
	}

	const resolvedOptions: TableOptionsResolved<TData> = mergeObjects(
		{
			state: {},
			onStateChange() {},
			renderFallbackValue: null,
			mergeOptions: (defaultOptions: TableOptions<TData>, options: Partial<TableOptions<TData>>) => {
				return mergeObjects(defaultOptions, options);
			},
		},
		options
	);

	const table = createTable(resolvedOptions);
	let state = $state<Partial<TableState>>(table.initialState);

	const updateOptions = (table: Table<TData>, state: Partial<TableState>) => {
		table.setOptions((prev) => {
			return mergeObjects(prev, options, {
				state: mergeObjects(state, options.state || {}),

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onStateChange: (updater: any) => {
					if (updater instanceof Function) state = updater(state);
					else state = mergeObjects(state, updater);

					options.onStateChange?.(updater);
				},
			});
		});
	};

	updateOptions(table, state);

	$effect.pre(() => {
		updateOptions(table, state);
	});
	return table;
}
