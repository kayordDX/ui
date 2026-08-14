<script lang="ts">
	import {
		DataTable,
		createShadTable,
		type ColumnDef,
		type ColumnFiltersState,
		type DataTableFeatures,
	} from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Button } from "$lib";

	interface HarnessRow {
		id: number;
		name: string;
	}

	// Unsorted, 12 rows so the default page size (10) yields two pages.
	const base = ["charlie", "alice", "eve", "bob", "dave", "frank"];
	let data = $state<HarnessRow[]>(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: base[i % base.length] })));

	let globalFilter = $state("");
	let nameFilter = $state("");
	const columnFilters = $derived<ColumnFiltersState>(nameFilter ? [{ id: "name", value: nameFilter }] : []);

	const columns: ColumnDef<DataTableFeatures, HarnessRow>[] = [
		{ accessorKey: "id", header: "ID" },
		{ accessorKey: "name", header: "Name" },
	];

	const table = createShadTable({
		columns,
		get data() {
			return data;
		},
		state: {
			get globalFilter() {
				return globalFilter;
			},
			get columnFilters() {
				return columnFilters;
			},
		},
		onGlobalFilterChange: (u) => {
			globalFilter = typeof u === "function" ? u(globalFilter) : u;
		},
		onColumnFiltersChange: (u) => {
			const next = typeof u === "function" ? u(columnFilters) : u;
			nameFilter = (next.find((f) => f.id === "name")?.value ?? "") as string;
		},
	});

	function addRecord() {
		// Prepend so the new row lands on the first page without re-sorting.
		data = [{ id: 999, name: "zebra-new" }, ...data];
	}
</script>

<Input placeholder="search-name" bind:value={nameFilter} />
<Input placeholder="global-filter" bind:value={globalFilter} />
<Button onclick={addRecord}>Add Record</Button>
<DataTable {table} />
