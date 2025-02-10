import type { TableState } from "@tanstack/table-core";

export class State {
	value = $state<Partial<TableState>>({});

	constructor(initState: Partial<TableState>) {
		if (!initState.sorting) {
			initState.sorting = [];
		}
		if (!initState.pagination) {
			initState.pagination = { pageIndex: 0, pageSize: 10 };
		}
		if (!initState.columnVisibility) {
			initState.columnVisibility = {};
		}
		if (!initState.rowSelection) {
			initState.rowSelection = {};
		}
		if (!initState.columnVisibility) {
			initState.columnVisibility = {};
		}

		this.value = initState;
	}
}
