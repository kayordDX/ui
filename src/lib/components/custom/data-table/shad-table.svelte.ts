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
	#state: Partial<TableState> = $state({});
	#stateUpdate: (state: Partial<TableState>) => void;
	options: ShadTableOptions<TData>;

	constructor(initOptions: ShadTableOptions<TData>, stateUpdate?: (state: Partial<TableState>) => void) {
		if (stateUpdate) {
			this.#stateUpdate = stateUpdate;
		} else {
			this.#stateUpdate = (state: Partial<TableState>) => {
				console.log("state updated boii");
				this.#state = state;
			};
		}
		this.options = initOptions;

		if (!this.options.getCoreRowModel) {
			this.options.getCoreRowModel = getCoreRowModel();
		}

		if ((this.options.enablePaging ?? true) == false) {
			this.options.manualPagination = true;
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
		this.#state = this.table.initialState;
		this.columns = this.options.columns;

		this.features();

		this.updateOptions();

		$effect.pre(() => {
			this.updateOptions();
		});

		$effect(() => {
			this.#stateUpdate(this.#state);
		});
	}

	updateOptions() {
		this.table.setOptions((prev) => {
			return mergeObjects(prev, this.options, {
				state: mergeObjects(this.#state, this.options.state || {}),

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				onStateChange: (updater: any) => {
					if (updater instanceof Function) this.#state = updater(this.#state);
					else this.#state = mergeObjects(this.#state, updater);

					this.options.onStateChange?.(updater);
				},
			});
		});
	}

	private features() {
		// Sorting
		if ((this.options.enableSorting ?? true) && !this.options.getSortedRowModel) {
			this.options.getSortedRowModel = getSortedRowModel();
			this.options.onSortingChange = (updater) => {
				if (typeof updater === "function") {
					if (this.options.state?.sorting) {
						this.options.state.sorting = updater(this.options.state.sorting);
					} else if (this.#state.sorting) {
						this.#state.sorting = updater(this.#state.sorting);
					}
				} else {
					if (this.options.state?.sorting) {
						this.options.state.sorting = updater;
					} else {
						this.#state.sorting = updater;
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
					} else if (this.#state.pagination) {
						this.#state.pagination = updater(this.#state.pagination);
					}
				} else {
					if (this.options.state?.pagination) {
						this.options.state.pagination = updater;
					} else {
						this.#state.pagination = updater;
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
					} else if (this.#state.rowSelection) {
						this.#state.rowSelection = updater(this.#state.rowSelection);
					}
				} else {
					if (this.options.state?.rowSelection) {
						this.options.state.rowSelection = updater;
					} else {
						this.#state.rowSelection = updater;
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
					} else if (this.#state.columnVisibility) {
						this.#state.columnVisibility = updater(this.#state.columnVisibility);
					}
				} else {
					if (this.options.state?.columnVisibility) {
						this.options.state.columnVisibility = updater;
					} else {
						this.#state.columnVisibility = updater;
					}
				}
			};
		}
	}
}

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
