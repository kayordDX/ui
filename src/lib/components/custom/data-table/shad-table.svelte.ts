import {
	createTable,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type ColumnDef,
	type RowData,
	type RowModel,
	type Table,
	type TableOptions,
	type TableOptionsResolved,
	type TableState,
} from "@tanstack/table-core";

interface ShadTableOptions<TData extends RowData> extends Omit<TableOptions<TData>, "getCoreRowModel"> {
	getCoreRowModel?: (table: Table<any>) => () => RowModel<any>;
	enablePaging?: boolean;
	enableVisibility?: boolean;
}

export class ShadTable<TData extends RowData> {
	columns: ColumnDef<TData>[];
	table: Table<TData>;
	state: Partial<TableState> = $state<Partial<TableState>>({});
	options: ShadTableOptions<TData>;

	constructor(initOptions: ShadTableOptions<TData>) {
		this.options = initOptions;

		if (!this.options.getCoreRowModel) {
			this.options.getCoreRowModel = getCoreRowModel();
		}

		const plainOptions = this.options as TableOptions<TData>;

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

		this.table = createTable(resolvedOptions);
		this.state = this.table.initialState;
		this.columns = this.options.columns;

		this.features();

		this.updateOptions();

		$effect.pre(() => {
			this.updateOptions();
		});
	}

	updateOptions() {
		this.table.setOptions((prev) => {
			return mergeObjects(prev, this.options, {
				state: mergeObjects(this.state, this.options.state || {}),

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onStateChange: (updater: any) => {
					if (updater instanceof Function) this.state = updater(this.state);
					else this.state = mergeObjects(this.state, updater);

					this.options.onStateChange?.(updater);
				},
			});
		});
	}

	features() {
		// Sorting
		if ((this.options.enableSorting ?? true) && !this.options.getSortedRowModel) {
			this.options.getSortedRowModel = getSortedRowModel();
			this.options.onSortingChange = (updater) => {
				if (typeof updater === "function") {
					if (this.options.state?.sorting) {
						this.options.state.sorting = updater(this.options.state.sorting);
					} else if (this.state.sorting) {
						this.state.sorting = updater(this.state.sorting);
					}
				} else {
					if (this.options.state?.sorting) {
						this.options.state.sorting = updater;
					} else {
						this.state.sorting = updater;
					}
				}
			};
		}

		// Paging
		if ((this.options.enablePaging ?? true) && !this.options.getPaginationRowModel) {
			this.options.getPaginationRowModel = getPaginationRowModel();
			this.options.onPaginationChange = (updater) => {
				if (typeof updater === "function") {
					if (this.options.state?.pagination) {
						this.options.state.pagination = updater(this.options.state.pagination);
					} else if (this.state.pagination) {
						this.state.pagination = updater(this.state.pagination);
					}
				} else {
					if (this.options.state?.pagination) {
						this.options.state.pagination = updater;
					} else {
						this.state.pagination = updater;
					}
				}
			};
		}

		// Row Selection
		if ((this.options.enableRowSelection ?? true) && !this.options.onRowSelectionChange) {
			this.options.onRowSelectionChange = (updater) => {
				if (typeof updater === "function") {
					if (this.options.state?.rowSelection) {
						this.options.state.rowSelection = updater(this.options.state.rowSelection);
					} else if (this.state.rowSelection) {
						this.state.rowSelection = updater(this.state.rowSelection);
					}
				} else {
					if (this.options.state?.rowSelection) {
						this.options.state.rowSelection = updater;
					} else {
						this.state.rowSelection = updater;
					}
				}
			};
		}

		// Column Visibility
		if ((this.options.enableVisibility ?? false) && !this.options.onColumnVisibilityChange) {
			this.options.onColumnVisibilityChange = (updater) => {
				if (typeof updater === "function") {
					if (this.options.state?.columnVisibility) {
						this.options.state.columnVisibility = updater(this.options.state.columnVisibility);
					} else if (this.state.columnVisibility) {
						this.state.columnVisibility = updater(this.state.columnVisibility);
					}
				} else {
					if (this.options.state?.columnVisibility) {
						this.options.state.columnVisibility = updater;
					} else {
						this.state.columnVisibility = updater;
					}
				}
			};
		}
	}
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
	let state = $state<Partial<TableState>>(table.initialState);

	function updateOptions() {
		table.setOptions((prev) => {
			return mergeObjects(prev, options, {
				state: mergeObjects(state, options.state || {}),

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onStateChange: (updater: any) => {
					if (updater instanceof Function) state = updater(state);
					else state = mergeObjects(state, updater);

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
				} else if (state.sorting) {
					state.sorting = updater(state.sorting);
				}
			} else {
				if (options.state?.sorting) {
					options.state.sorting = updater;
				} else {
					state.sorting = updater;
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
				} else if (state.pagination) {
					state.pagination = updater(state.pagination);
				}
			} else {
				if (options.state?.pagination) {
					options.state.pagination = updater;
				} else {
					state.pagination = updater;
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
				} else if (state.rowSelection) {
					state.rowSelection = updater(state.rowSelection);
				}
			} else {
				if (options.state?.rowSelection) {
					options.state.rowSelection = updater;
				} else {
					state.rowSelection = updater;
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
				} else if (state.columnVisibility) {
					state.columnVisibility = updater(state.columnVisibility);
				}
			} else {
				if (options.state?.columnVisibility) {
					options.state.columnVisibility = updater;
				} else {
					state.columnVisibility = updater;
				}
			}
		};
	}

	updateOptions();

	$effect.pre(() => {
		updateOptions();
	});

	return table;
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
