<script lang="ts">
	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";

	interface SelectionRow {
		id: number;
		name: string;
	}

	// 12 rows: default page size (10) leaves rows unselected overall, which
	// exercises the indeterminate header state.
	const data: SelectionRow[] = Array.from({ length: 12 }, (_, i) => ({
		id: i + 1,
		name: `row-${i + 1}`,
	}));

	const columns: ColumnDef<DataTableFeatures, SelectionRow>[] = [
		{ accessorKey: "id", header: "ID" },
		{ accessorKey: "name", header: "Name" },
	];

	const table = createShadTable({
		columns,
		data,
		enableRowSelection: true,
	});
</script>

<DataTable {table} />
