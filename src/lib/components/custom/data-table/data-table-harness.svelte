<script lang="ts">
	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Button } from "$lib";

	interface HarnessRow {
		id: number;
		name: string;
	}

	// Unsorted, 12 rows so the default page size (10) yields two pages.
	const base = ["charlie", "alice", "eve", "bob", "dave", "frank"];
	let data = $state<HarnessRow[]>(Array.from({ length: 12 }, (_, i) => ({ id: i + 1, name: base[i % base.length] })));

	const columns: ColumnDef<DataTableFeatures, HarnessRow>[] = [
		{ accessorKey: "id", header: "ID" },
		{ accessorKey: "name", header: "Name" },
	];

	// Uncontrolled table: filtering state lives in the table's atoms and the
	// inputs write to it via the setter APIs.
	const table = createShadTable({
		columns,
		get data() {
			return data;
		},
	});

	function filterName(value: string) {
		table.setColumnFilters(value ? [{ id: "name", value }] : []);
	}

	function addRecord() {
		// Prepend so the new row lands on the first page without re-sorting.
		data = [{ id: 999, name: "zebra-new" }, ...data];
	}
</script>

<Input
	placeholder="search-name"
	value={String(table.atoms.columnFilters.get().find((f) => f.id === "name")?.value ?? "")}
	oninput={(e) => filterName(e.currentTarget.value)}
/>
<Input
	placeholder="global-filter"
	value={String(table.atoms.globalFilter.get() ?? "")}
	oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
/>
<Button onclick={addRecord}>Add Record</Button>
<DataTable {table} />
