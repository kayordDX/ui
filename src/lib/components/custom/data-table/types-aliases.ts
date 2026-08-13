import type { ColumnDef, RowData, Table, Updater } from "@tanstack/svelte-table";
import type { DataTableFeatures } from "./features";

/** A {@link ColumnDef} pre-bound to the library's feature set. */
export type ShadColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<DataTableFeatures, TData, TValue>;

/** A {@link Table} pre-bound to the library's feature set. */
export type ShadTable<TData extends RowData> = Table<DataTableFeatures, TData>;

export type ShadUpdater<TState> = Updater<TState>;
