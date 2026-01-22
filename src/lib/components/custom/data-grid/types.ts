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
import type { Snippet } from "svelte";
import z from "zod";

export interface DataGrid<T> {
	table?: Table<T>;
	columns: ColumnDef<T, unknown>[];
	data: T[];
	isLoading?: boolean;
	noDataMessage?: string;
	class?: string;
	headerClass?: string;
	tableProps?: TableProps;
	snippets?: Snippets;
	uiConfig?: DataGridUIConfig;
}

interface DataGridUIConfig {
	hideHeader?: boolean;
	enableVisibility?: boolean;
	disableUISorting?: boolean;
}

interface Snippets {
	header?: Snippet;
	subHeader?: Snippet;
	footer?: Snippet;
	leftToolbar?: Snippet;
	rightToolbar?: Snippet;
}

export interface DataGridOptions<TData extends RowData> {
	columns: () => ColumnDef<TData, unknown>[];
	data: () => TData[];
	tableProps: () => TableProps;
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
}

export interface TableProps {
	rowCount?: () => number;
	isPaginationEnabled?: boolean;
	manualPagination?: boolean;
	enableRowSelectionUI?: boolean;
	manualFiltering?: boolean;
	manualSorting?: boolean;
	useURLSearchParams?: boolean;
}

export const defaultTableProps: TableProps = {
	isPaginationEnabled: true,
	manualPagination: false,
	enableRowSelectionUI: false,
	manualFiltering: false,
	manualSorting: false,
	useURLSearchParams: false,
};

export type DataGridResponse<TData extends RowData> = Table<TData>;

export const defaultSearchParamSchema = z.object({
	search: z.any().default(""),
	page: z.coerce.number().default(0),
	filter: z.string().default(""),
	sort: z.string().default(""),
});

export type SearchParamSchema = z.infer<typeof defaultSearchParamSchema>;

export interface CustomOptions {
	useURLSearchParams?: boolean;
}

export interface CustomColumnMeta {
	className?: string;
}
