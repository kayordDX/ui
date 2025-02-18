import { createSvelteTable } from "$lib/components/ui";
import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type RowData,
	type RowModel,
	type Table,
	type TableOptions,
	type TableOptionsResolved,
} from "@tanstack/table-core";
import { State } from "./state.svelte";

interface ShadTableOptions<TData extends RowData> extends Omit<TableOptions<TData>, "getCoreRowModel"> {
	getCoreRowModel?: (table: Table<any>) => () => RowModel<any>;
	enablePaging?: boolean;
	enableVisibility?: boolean;
}

export const createShadTable = <TData extends RowData>(options: ShadTableOptions<TData>) => {
	// Set the default getCoreRowModel
	if (!options.getCoreRowModel) {
		options.getCoreRowModel = getCoreRowModel();
	}

	const plainOptions = options as TableOptions<TData>;

	const resolvedOptions: TableOptionsResolved<TData> = mergeObjects(
		{
			state: {},
			onStateChange() {},
			renderFallbackValue: null,
			mergeOptions: (defaultOptions: TableOptions<TData>, options: Partial<TableOptions<TData>>) => {
				return mergeObjects(defaultOptions, options);
			},
		},
		plainOptions
	);

	const table = createTable(resolvedOptions);
	const state = new State(options.state ?? {});

	function updateOptions() {
		table.setOptions((prev) => {
			return mergeObjects(prev, options, {
				state: mergeObjects(state, options.state || {}),

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onStateChange: (updater: any) => {
					if (updater instanceof Function) state.value = updater(state);
					else state.value = mergeObjects(state, updater);

					options.onStateChange?.(updater);
				},
			});
		});
	}

	// Sorting
	if ((options.enableSorting ?? true) && !options.getSortedRowModel) {
		options.getSortedRowModel = getSortedRowModel();
		options.onSortingChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.sorting) {
					options.state.sorting = updater(options.state.sorting);
				} else if (state.value.sorting) {
					state.value.sorting = updater(state.value.sorting);
				}
			} else {
				if (options.state?.sorting) {
					options.state.sorting = updater;
				} else {
					state.value.sorting = updater;
				}
			}
		};
	}

	// Paging
	if ((options.enablePaging ?? true) && !options.getPaginationRowModel) {
		options.getPaginationRowModel = getPaginationRowModel();
		options.onPaginationChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.pagination) {
					options.state.pagination = updater(options.state.pagination);
				} else if (state.value.pagination) {
					state.value.pagination = updater(state.value.pagination);
				}
			} else {
				if (options.state?.pagination) {
					options.state.pagination = updater;
				} else {
					state.value.pagination = updater;
				}
			}
		};
	}

	// Row Selection
	if ((options.enableRowSelection ?? true) && !options.onRowSelectionChange) {
		options.onRowSelectionChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.rowSelection) {
					options.state.rowSelection = updater(options.state.rowSelection);
				} else if (state.value.rowSelection) {
					state.value.rowSelection = updater(state.value.rowSelection);
				}
			} else {
				if (options.state?.rowSelection) {
					options.state.rowSelection = updater;
				} else {
					state.value.rowSelection = updater;
				}
			}
		};
	}

	// Column Visibility
	if ((options.enableVisibility ?? false) && !options.onColumnVisibilityChange) {
		options.onColumnVisibilityChange = (updater) => {
			if (typeof updater === "function") {
				if (options.state?.columnVisibility) {
					options.state.columnVisibility = updater(options.state.columnVisibility);
				} else if (state.value.columnVisibility) {
					state.value.columnVisibility = updater(state.value.columnVisibility);
				}
			} else {
				if (options.state?.columnVisibility) {
					options.state.columnVisibility = updater;
				} else {
					state.value.columnVisibility = updater;
				}
			}
		};
	}

	options.state = state.value;

	updateOptions();

	$effect.pre(() => {
		updateOptions();
	});

	const tableOptions = options as unknown as TableOptions<TData>;
	return createSvelteTable(tableOptions);
};

function mergeObjects<T>(source: T): T;
function mergeObjects<T, U>(source: T, source1: U): T & U;
function mergeObjects<T, U, V>(source: T, source1: U, source2: V): T & U & V;
function mergeObjects<T, U, V, W>(source: T, source1: U, source2: V, source3: W): T & U & V & W;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mergeObjects(...sources: any): any {
	const target = {};
	for (let i = 0; i < sources.length; i++) {
		let source = sources[i];
		if (typeof source === "function") source = source();
		if (source) {
			const descriptors = Object.getOwnPropertyDescriptors(source);
			for (const key in descriptors) {
				if (key in target) continue;
				Object.defineProperty(target, key, {
					enumerable: true,
					get() {
						for (let i = sources.length - 1; i >= 0; i--) {
							let s = sources[i];
							if (typeof s === "function") s = s();
							const v = (s || {})[key];
							if (v !== undefined) return v;
						}
					},
				});
			}
		}
	}
	return target;
}
