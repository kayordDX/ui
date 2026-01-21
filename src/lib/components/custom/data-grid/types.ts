import type {
	ColumnDef,
	ColumnFiltersState,
	ColumnPinningState,
	ColumnSizingState,
	GlobalFilterTableState,
	PaginationState,
	RowData,
	RowSelectionState,
	SortingState,
	Table,
	VisibilityState,
} from "@tanstack/table-core";
import z from "zod";

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
		globalFilter?: GlobalFilterTableState;
	};
	dataGridProps?: DataGridProps;
}

export interface DataGridProps {
	isPaginationEnabled?: boolean;
	manualPagination?: boolean;
	enableRowSelectionUI?: boolean;
	manualFiltering?: boolean;
	manualSorting?: boolean;
	useURLSearchParams?: boolean;
}

export const defaultDataGridProps: DataGridProps = {
	isPaginationEnabled: true,
	manualPagination: false,
	enableRowSelectionUI: false,
	manualFiltering: false,
	manualSorting: false,
	useURLSearchParams: false,
};

export interface DataGridResponse<TData extends RowData> {
	table: Table<TData>;
	dataGridProps?: DataGridProps;
}

export const defaultSearchParamSchema = z.object({
	search: z.any().default(""),
	page: z.coerce.number().default(0),
	filter: z.string().default(""),
	sort: z.string().default(""),
	// sort: z
	// 	.array(
	// 		z.object({
	// 			desc: z.boolean(),
	// 			id: z.string(),
	// 		})
	// 	)
	// 	.default([]),
	// page: z.object({
	// 	pageIndex: z.number(),
	// 	pageSize: z.number(),
	// }),
	// globalFilter: z.any(),
	// columnFilters: z.array(
	// 	z.object({
	// 		id: z.string(),
	// 		value: z.unknown(),
	// 	})
	// ),
});

// const what = useSearchParams(defaultSearchParamSchema);
export type SearchParamSchema = z.infer<typeof defaultSearchParamSchema>;
