<script lang="ts">
	interface DataType {
		id: number;
		name: string;
		day: string;
		joined: Date;
		tags: string[];
	}

	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	const rows: DataType[] = Array.from({ length: 30 }, (_, i) => ({
		id: i + 1,
		name: ["alice", "bob", "charlie", "dave", "eve"][i % 5],
		day: days[i % 7],
		joined: new Date(Date.UTC(2025, i % 12, (i % 27) + 1)),
		tags: [["admin"], ["admin", "editor"], ["viewer"]][i % 3],
	}));

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			meta: { variant: "number" },
		},
		{
			accessorKey: "name",
			header: "Name",
			meta: { label: "Name" },
		},
		{
			accessorKey: "day",
			header: "Day",
			meta: {
				variant: "select",
				options: days.map((day) => ({ label: day, value: day })),
			},
		},
		{
			accessorKey: "joined",
			header: "Joined",
			meta: { variant: "date" },
		},
		{
			accessorKey: "tags",
			header: "Tags",
			meta: { variant: "multi-select" },
		},
	];

	const table = createShadTable({
		columns,
		data: rows,
		enableRowSelection: false,
	});
</script>

<DataTable {table} enableFilters headerClass="mt-2" />
