import { CustomOptions, CustomColumnMeta } from "$lib/components/custom/data-table/types";

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare module "@tanstack/table-core" {
	interface ColumnMeta<TData extends RowData, TValue> extends CustomColumnMeta {}
	interface TableOptionsResolved<TData extends RowData> extends CustomOptions {}
}

export {};
