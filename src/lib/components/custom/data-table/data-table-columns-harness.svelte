<script lang="ts">
	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import { Button } from "$lib";

	interface ColumnsRow {
		id: number;
		name: string;
		age: number;
	}

	const data: ColumnsRow[] = [
		{ id: 1, name: "alice", age: 30 },
		{ id: 2, name: "bob", age: 40 },
	];

	let showAge = $state(false);
	const columns = $derived<ColumnDef<DataTableFeatures, ColumnsRow>[]>(
		showAge
			? [
					{ accessorKey: "id", header: "ID" },
					{ accessorKey: "name", header: "Name" },
					{ accessorKey: "age", header: "Age" },
				]
			: [
					{ accessorKey: "id", header: "ID" },
					{ accessorKey: "name", header: "Name" },
				]
	);

	// `get columns()` keeps the column defs reactive (mirrors the `data` getter).
	const table = createShadTable({
		get columns() {
			return columns;
		},
		data,
	});

	function toggleAge() {
		showAge = !showAge;
	}
</script>

<Button onclick={toggleAge}>Toggle Age Column</Button>
<DataTable {table} />
