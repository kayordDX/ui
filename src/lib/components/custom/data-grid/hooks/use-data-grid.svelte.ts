import { createSubscriber } from "svelte/reactivity";
import {
	createTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	type ColumnDef,
	type RowData,
	type TableOptions,
	type TableOptionsResolved,
	type Table,
	type SortingState,
	type ColumnFiltersState,
	type RowSelectionState,
	type ColumnPinningState,
	type VisibilityState,
	type ColumnSizingState,
	type ColumnSizingInfoState,
} from "@tanstack/table-core";

// ============================================
// Types
// ============================================

export interface UseDataGridOptions<TData extends RowData> {
	columns: ColumnDef<TData, unknown>[];
	/** Pass data as a getter function for reactivity: () => data */
	data: TData[] | (() => TData[]);
	initialState?: {
		sorting?: SortingState;
		columnFilters?: ColumnFiltersState;
		columnVisibility?: VisibilityState;
		columnPinning?: ColumnPinningState;
		columnSizing?: ColumnSizingState;
		rowSelection?: RowSelectionState;
	};
}

export interface UseDataGridReturn<TData extends RowData> {
	// Table instance
	table: Table<TData>;
	// Row selection state - reactive for header checkbox
	getRowSelection: () => RowSelectionState;
}

// ============================================
// Main Hook
// ============================================

export function useDataGrid<TData extends RowData>(options: UseDataGridOptions<TData>): UseDataGridReturn<TData> {
	const { columns, data: dataProp, initialState } = options;

	// Support both direct data array and getter function for reactivity
	// Using a getter function () => data allows Svelte 5 to track changes
	const getData = typeof dataProp === "function" ? dataProp : () => dataProp;

	// ========================================
	// Reactive State using Svelte 5 runes
	// ========================================

	// Table state - use initialState if provided
	let sorting = $state<SortingState>(initialState?.sorting ?? []);
	let columnFilters = $state<ColumnFiltersState>(initialState?.columnFilters ?? []);
	let rowSelection = $state<RowSelectionState>(initialState?.rowSelection ?? {});
	let columnPinning = $state<ColumnPinningState>(initialState?.columnPinning ?? {});
	let columnVisibility = $state<VisibilityState>(initialState?.columnVisibility ?? {});
	let columnSizing = $state<ColumnSizingState>(initialState?.columnSizing ?? {});
	let columnSizingInfo = $state<ColumnSizingInfoState>({
		startOffset: null,
		startSize: null,
		deltaOffset: null,
		deltaPercentage: null,
		isResizingColumn: false,
		columnSizingStart: [],
	});

	// ========================================
	// Create TanStack Table
	// ========================================

	// Initialize column sizing state from column definitions (only if not provided in initialState)
	$effect.pre(() => {
		if (Object.keys(columnSizing).length === 0) {
			const sizing: Record<string, number> = {};
			for (const col of columns) {
				if (col.size) {
					sizing[col.id as string] = col.size;
				}
			}
			if (Object.keys(sizing).length > 0) {
				columnSizing = sizing;
			}
		}
	});

	// Create the base table options
	const baseTableOptions: TableOptionsResolved<TData> = {
		data: getData(),
		columns,
		state: {
			sorting,
			columnFilters,
			rowSelection,
			columnPinning,
			columnVisibility,
			columnSizing,
			columnSizingInfo,
		},
		onColumnSizingChange: (updater) => {
			columnSizing = typeof updater === "function" ? updater(columnSizing) : updater;
		},
		onColumnSizingInfoChange: (updater) => {
			columnSizingInfo = typeof updater === "function" ? updater(columnSizingInfo) : updater;
		},
		onColumnPinningChange: (updater) => {
			columnPinning = typeof updater === "function" ? updater(columnPinning) : updater;
		},
		onColumnVisibilityChange: (updater) => {
			columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
			// No version counter needed - visibilityKey is derived from columnVisibility
			// and will automatically update when visibility changes
		},
		onSortingChange: (updater) => {
			sorting = typeof updater === "function" ? updater(sorting) : updater;
		},
		onColumnFiltersChange: (updater) => {
			columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
		},
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		columnResizeMode: "onChange",
		enableColumnResizing: true,
		defaultColumn: {
			minSize: 60,
			maxSize: 1000,
			size: 150,
		},
		enableRowSelection: true,
		enableColumnFilters: true,
		enableFilters: true,
		renderFallbackValue: null,
		onStateChange: () => {},
		mergeOptions: (defaultOptions: TableOptions<TData>, newOptions: Partial<TableOptions<TData>>) => {
			return { ...defaultOptions, ...newOptions };
		},
	};

	const table = createTable(baseTableOptions);

	// Create a subscriber to notify effects when table data changes
	// This is the key to making TanStack Table reactive in Svelte 5
	// When data comes from async sources (like database queries), the table needs
	// to notify consuming components that data has changed so they can re-render
	let notifyTableUpdate: () => void;
	const subscribeToTable = createSubscriber((update) => {
		notifyTableUpdate = update;
		return () => {};
	});

	// This is the key to reactivity: update table options in $effect.pre
	// whenever any of the state values change
	$effect.pre(() => {
		// Read all reactive state to create dependencies
		const currentState = {
			sorting,
			columnFilters,
			rowSelection,
			columnPinning,
			columnVisibility,
			columnSizing,
			columnSizingInfo,
		};
		const currentData = getData();

		// Update table with current state
		table.setOptions((prev) => ({
			...prev,
			data: currentData,
			state: {
				...prev.state,
				...currentState,
			},
		}));

		// Notify any subscribers that table data has changed
		// This triggers re-runs of effects/derived that called subscribeToTable()
		notifyTableUpdate?.();
	});

	// ========================================
	// Return
	// ========================================

	// Create a reactive table wrapper that exposes state-dependent getters
	// This is key to making the table reactive in Svelte 5
	// We use subscribeToTable() to register effects as subscribers, so they
	// re-run when notifyTableUpdate() is called after data changes
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
		getColumn: (columnId: string) => {
			subscribeToTable();
			return table.getColumn(columnId);
		},
		// Forward all other methods to the original table
		setColumnFilters: table.setColumnFilters.bind(table),
		setSorting: table.setSorting.bind(table),
		setColumnPinning: table.setColumnPinning.bind(table),
		setColumnVisibility: table.setColumnVisibility.bind(table),
		setRowSelection: table.setRowSelection.bind(table),
		setColumnSizing: table.setColumnSizing.bind(table),
		setOptions: table.setOptions.bind(table),
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

	return {
		table: reactiveTable,
		getRowSelection: () => rowSelection,
	};
}
