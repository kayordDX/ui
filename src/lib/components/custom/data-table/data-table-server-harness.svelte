<script lang="ts">
	import { createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import { Button } from "$lib";

	interface Row {
		id: number;
		name: string;
	}

	const columns: ColumnDef<DataTableFeatures, Row>[] = [
		{ accessorKey: "id", header: "ID" },
		{ accessorKey: "name", header: "Name" },
	];

	// Simulate a server response: `rows` is the current page, `total` the row count.
	let rows = $state<Row[]>([]);
	let total = $state(0);

	const table = createShadTable({
		columns,
		get data() {
			return rows;
		},
		get rowCount() {
			return total;
		},
		manualPagination: true,
	});

	function load() {
		total = 42;
		rows = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `row-${i + 1}` }));
	}
</script>

<Button onclick={load}>Load</Button>
<div data-testid="page-count">{table.getPageCount()}</div>
<div data-testid="row-count">{table.getRowModel().rows.length}</div>
