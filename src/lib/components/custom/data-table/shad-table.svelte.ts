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
import { renderComponent } from "$lib/data-table";
import { mergeObjects } from "$lib/components/ui/data-table/data-table.svelte";
import { createSubscriber } from "svelte/reactivity";

interface ShadTableOptions<TData extends RowData> extends Omit<TableOptions<TData>, "getCoreRowModel"> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getCoreRowModel?: (table: Table<any>) => () => RowModel<any>;
	enablePaging?: boolean;
	enableVisibility?: boolean;
	enableRowSelectionUI?: boolean;
}

export function createShadTable<TData extends RowData>(shadOptions: ShadTableOptions<TData>) {
	let notifyTableUpdate: () => void;
	const subscribeToTable = createSubscriber((update) => {
		notifyTableUpdate = update;
		return () => {};
	});

	const defaultOptions: TableOptions<TData> = {
		columns: shadOptions.columns,
		data: shadOptions.data,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: "auto",
		columnResizeMode: "onChange",
		// enableColumnResizing: true
		enableRowSelection: false,
		// enableFilters: true,
		enableGlobalFilter: true,
		onSortingChange: (updater) => {
			if (options.state?.sorting) {
				options.state.sorting = typeof updater === "function" ? updater(options.state.sorting) : updater;
			} else if (state.sorting) {
				state.sorting = typeof updater === "function" ? updater(state.sorting) : updater;
			}
			notifyTableUpdate();
		},
		// onColumnSizingChange: (updater) => {
		// 	columnSizing = typeof updater === "function" ? updater(columnSizing) : updater;
		// },
		// onColumnSizingInfoChange: (updater) => {
		// 	columnSizingInfo = typeof updater === "function" ? updater(columnSizingInfo) : updater;
		// },
		// onColumnPinningChange: (updater) => {
		// 	columnPinning = typeof updater === "function" ? updater(columnPinning) : updater;
		// },
		onColumnVisibilityChange: (updater) => {
			if (options.state?.columnVisibility) {
				options.state.columnVisibility =
					typeof updater === "function" ? updater(options.state.columnVisibility) : updater;
			} else if (state.columnVisibility) {
				state.columnVisibility = typeof updater === "function" ? updater(state.columnVisibility) : updater;
			}
			notifyTableUpdate();
		},
		onPaginationChange: (updater) => {
			if (options.state?.pagination) {
				options.state.pagination = typeof updater === "function" ? updater(options.state.pagination) : updater;
			} else if (state.pagination) {
				state.pagination = typeof updater === "function" ? updater(state.pagination) : updater;
			}
			notifyTableUpdate();
		},
		onColumnFiltersChange: (updater) => {
			if (options.state?.columnFilters) {
				options.state.columnFilters = typeof updater === "function" ? updater(options.state.columnFilters) : updater;
			} else if (state.columnFilters) {
				state.columnFilters = typeof updater === "function" ? updater(state.columnFilters) : updater;
			}
			notifyTableUpdate();
		},
		onRowSelectionChange: (updater) => {
			if (options.state?.rowSelection) {
				options.state.rowSelection = typeof updater === "function" ? updater(options.state.rowSelection) : updater;
			} else if (state.rowSelection) {
				state.rowSelection = typeof updater === "function" ? updater(state.rowSelection) : updater;
			}
			notifyTableUpdate();
		},
		onGlobalFilterChange: (updater) => {
			if (options.state?.globalFilter) {
				options.state.globalFilter = typeof updater === "function" ? updater(options.state.globalFilter) : updater;
			} else {
				state.globalFilter = typeof updater === "function" ? updater(state.globalFilter) : updater;
			}
			notifyTableUpdate();
		},
	};

	if (shadOptions.useURLSearchParams) {
		shadOptions.autoResetPageIndex = false;
	}

	// Use default but extend with shadOptions
	const options = { ...defaultOptions, ...((shadOptions as TableOptions<TData>) ?? {}) };

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
	const state = $state<Partial<TableState>>(table.initialState);

	// Row Selection
	if (options.enableRowSelection && (shadOptions.enableRowSelectionUI ?? true)) {
		const rowSelectionColumn: ColumnDef<TData> = {
			id: "select",
			header: () => {
				subscribeToTable();
				return renderComponent(DataTableCheckbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected(),
					onCheckedChange: () => table.toggleAllPageRowsSelected(),
				});
			},
			cell: (r) => {
				subscribeToTable();
				return renderComponent(DataTableCheckbox, {
					checked: r.row.getIsSelected(),
					onCheckedChange: () => r.row.toggleSelected(),
				});
			},
			enableResizing: false,
			enableSorting: false,
		};
		options.columns.unshift(rowSelectionColumn);
	}

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

	const reactiveTable = {
		// Expose all original table methods and properties
		...table,
		// Override methods that depend on state to create reactive dependencies
		getRowModel: () => {
			subscribeToTable();
			return table.getRowModel();
		},
		getHeaderGroups: () => {
			subscribeToTable();
			return table.getHeaderGroups();
		},
		getAllColumns: () => {
			subscribeToTable();
			return table.getAllColumns();
		},
		getVisibleLeafColumns: () => {
			subscribeToTable();
			return table.getVisibleLeafColumns();
		},
		getState: () => {
			subscribeToTable();
			return table.getState();
		},
		getPageCount: () => {
			subscribeToTable();
			return table.getPageCount();
		},
		getColumn: (columnId: string) => {
			subscribeToTable();
			return table.getColumn(columnId);
		},
		// Forward all other methods to the original table
		setColumnFilters: table.setColumnFilters.bind(table),
		setSorting: table.setSorting.bind(table),
		setPagination: table.setPagination.bind(table),
		setPageIndex: table.setPageIndex.bind(table),
		setPageSize: table.setPageSize.bind(table),
		setColumnPinning: table.setColumnPinning.bind(table),
		setColumnVisibility: table.setColumnVisibility.bind(table),
		setRowSelection: table.setRowSelection.bind(table),
		setColumnSizing: table.setColumnSizing.bind(table),
		setOptions: table.setOptions.bind(table),
		setGlobalFilter: table.setGlobalFilter.bind(table),
		getFlatHeaders: () => {
			subscribeToTable();
			return table.getFlatHeaders();
		},
		getTotalSize: () => {
			subscribeToTable();
			return table.getTotalSize();
		},
		getLeftLeafColumns: () => {
			subscribeToTable();
			return table.getLeftLeafColumns();
		},
		getRowCount: () => {
			subscribeToTable();
			return table.getRowCount();
		},
		getRightLeafColumns: () => {
			subscribeToTable();
			return table.getRightLeafColumns();
		},
		getCenterLeafColumns: () => {
			subscribeToTable();
			return table.getCenterLeafColumns();
		},
		getIsAllRowsSelected: () => {
			subscribeToTable();
			return table.getIsAllRowsSelected();
		},
		getIsSomeRowsSelected: () => {
			subscribeToTable();
			return table.getIsSomeRowsSelected();
		},
		getIsAllPageRowsSelected: () => {
			subscribeToTable();
			return table.getIsAllPageRowsSelected();
		},
		getIsSomePageRowsSelected: () => {
			subscribeToTable();
			return table.getIsSomePageRowsSelected();
		},
		getCanPreviousPage: () => {
			subscribeToTable();
			return table.getCanPreviousPage();
		},
		getCanNextPage: () => {
			subscribeToTable();
			return table.getCanNextPage();
		},
		getFilteredSelectedRowModel: () => {
			subscribeToTable();
			return table.getFilteredSelectedRowModel();
		},
		toggleAllRowsSelected: table.toggleAllRowsSelected.bind(table),
		toggleAllPageRowsSelected: table.toggleAllPageRowsSelected.bind(table),
		// Keep table reference for any other property access
		_getDefaultColumnDef: table._getDefaultColumnDef.bind(table),
		get options() {
			subscribeToTable();
			return table.options;
		},
		initialState: table.initialState,
	} as unknown as Table<TData>;

	return reactiveTable;
}
