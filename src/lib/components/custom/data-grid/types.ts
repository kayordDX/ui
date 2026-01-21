import type {
	ColumnDef,
	ColumnFiltersState,
	ColumnPinningState,
	ColumnSizingState,
	PaginationState,
	RowData,
	RowSelectionState,
	SortingState,
	Table,
	VisibilityState,
} from "@tanstack/table-core";

export interface DataGridOptions<TData extends RowData> {
	columns: ColumnDef<TData, unknown>[];
	data: TData[] | (() => TData[]);
	initialState?: {
		sorting?: SortingState;
		pagination?: PaginationState;
		columnFilters?: ColumnFiltersState;
		columnVisibility?: VisibilityState;
		columnPinning?: ColumnPinningState;
		columnSizing?: ColumnSizingState;
		rowSelection?: RowSelectionState;
	};
	dataGridProps?: DataGridProps;
}

export interface DataGridProps {
	isPaginationEnabled?: boolean;
	manualPagination?: boolean;
	enableRowSelectionUI?: boolean;
}

export const defaultDataGridProps: DataGridProps = {
	isPaginationEnabled: true,
	manualPagination: false,
};

export interface DataGridResponse<TData extends RowData> {
	table: Table<TData>;
	dataGridProps?: DataGridProps;
}
