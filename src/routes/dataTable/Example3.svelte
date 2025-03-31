<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import {
		getFilteredRowModel,
		type ColumnDef,
		type GlobalFilterTableState,
		type TableState,
		type Updater,
	} from "@tanstack/table-core";

	import { data } from "./data.svelte";
	import { Button, DataTable } from "$lib";
	import { createShadTable } from "$lib/components/custom/data-table/shad-table.svelte";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			header: "Id",
			maxSize: 10,
		},
		{
			accessorKey: "name",
			header: "Name",
			cell: (info) => info.getValue(),
			size: 100000,
		},
		{
			header: "Day",
			accessorKey: "day",
			size: 100,
			minSize: 150,
		},
	];

	let sss = $state<Partial<TableState>>({});

	let globalFilter: GlobalFilterTableState = $state({ globalFilter: undefined });
	const setGlobalFilter = (updater: Updater<GlobalFilterTableState>) => {
		console.log("global filter updater");
		if (updater instanceof Function) {
			globalFilter = updater(globalFilter);
		} else globalFilter = updater;
	};

	const table = createShadTable(
		{
			columns,
			get data() {
				return data.value;
			},
			state: {
				get globalFilter() {
					return globalFilter;
				},
			},
			onGlobalFilterChange: setGlobalFilter,
			enableRowSelection: false,
			enableVisibility: true,
			enableGlobalFilter: true,
		},
		(state) => (sss = state)
	);

	$inspect(sss);

	const tttt = $derived(table.getState());
</script>

<DataTable {table} headerClass="mt-2" enableVisibility />
<div>"globalFilter": {JSON.stringify(table.getState())}</div>
<Button onclick={() => table.setColumnFilters([{ id: "name", value: "z" }])}>Filter 1</Button>
<Button onclick={() => table.resetColumnFilters()}>Reset</Button>
<Button onclick={() => table.setGlobalFilter("z")}>Global Filter</Button>
<Button onclick={() => table.resetGlobalFilter()}>Reset Global</Button>
