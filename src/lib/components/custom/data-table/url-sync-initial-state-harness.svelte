<script lang="ts">
	import { createShadTable, useTableUrlSync, type ColumnDef, type DataTableFeatures } from "$lib/data-table";

	interface DataType {
		id: number;
		name: string;
	}

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
		{ accessorKey: "id", header: "ID", maxSize: 10 },
		{ accessorKey: "name" },
	];

	const tableData: DataType[] = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `name-${i}` }));

	export const table = createShadTable({
		columns,
		data: tableData,
		enableRowSelection: false,
		initialState: {
			sorting: [{ id: "name", desc: false }],
			pagination: { pageIndex: 1, pageSize: 10 },
		},
	});

	useTableUrlSync(table);
</script>
