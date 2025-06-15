declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

declare module "@tanstack/table-core" {
	interface ColumnMeta<TData extends RowData, TValue> {
		className: string;
	}
}

export {};
