<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";

	const data: Array<DataType> = [
		{
			id: 1,
			name: "Super long text that should start to overflow Super long text that should start to overflowSuper long text that should start to overflow Super long text that should start to overflow Super long text that should start to overflow Super long text that should start to overflow Super long text that should start to overflow",
		},
		{
			id: 2,
			name: "Super long text that should start to overflow  Super long text that should start to overflow Super long text that should start to overflow  Super long text that should start to overflow",
		},
		{
			id: 3,
			name: "Super long text that should start to overflow  Super long text that should start to overflow Super long text that should start to overflow  Super long text that should start to overflow Super long text that should start to overflow  Super long text that should start to overflow",
		},
	];

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			maxSize: 10,
		},
		{
			accessorKey: "name",
			cell: (info) => info.getValue(),
			size: 100000,
			meta: {
				className: "wrap-text whitespace-normal",
			},
		},
		{
			header: "Day",
			accessorKey: "day",
			size: 100,
			minSize: 150,
		},
	];

	// v9 owns row-selection state internally — no lift needed.
	const table = createShadTable({
		columns,
		data: data,
		enableRowSelection: true,
	});
</script>

<DataTable {table} enableVisibility enableFullscreen headerClass="mt-2" class="w-[700px]" />
