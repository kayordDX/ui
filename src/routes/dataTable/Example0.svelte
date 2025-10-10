<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { type ColumnDef, type ColumnFiltersState } from "@tanstack/table-core";
	import { data } from "./data.svelte";
	import { DataTable, createShadTable } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";
	import { decodeColumnFilters } from "$lib/components/custom/data-table/table-search-params";

	let search = $state(decodeColumnFilters()?.find((x) => x.id == "name")?.value ?? "");
	let columnFilters = $state<ColumnFiltersState>(decodeColumnFilters() ?? []);

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			maxSize: 10,
		},
		{
			accessorKey: "name",
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

	const table = createShadTable({
		columns,
		data: data.value,
		enableRowSelection: false,
		useURLSearchParams: true,
		onColumnFiltersChange: (updater) => {
			if (typeof updater === "function") {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		state: {
			// get globalFilter() {
			// 	return search;
			// },
			get columnFilters() {
				return columnFilters;
			},
		},
	});

	$effect(() => {
		if (search) {
			columnFilters = [{ id: "name", value: search }];
		} else {
			columnFilters = [];
		}
	});
</script>

<Input bind:value={search} />
<DataTable {table} enableFullscreen headerClass="mt-2" />
