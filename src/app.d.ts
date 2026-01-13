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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> extends CustomColumnMeta {}
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
	interface TableOptionsResolved<TData extends RowData> extends CustomOptions {}
}

export {};
