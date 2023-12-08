<script lang="ts">
	import { DataTableActions } from "$lib/components/custom/data-table";
	import { Badge } from "$lib";
	import { data, type Payment } from "$lib/components/custom/data-table/data";
	import { DataTable } from "$lib/components/custom/data-table";
	import { flexRender, type ColumnDef, createColumnHelper } from "@tanstack/svelte-table";

	const columnHelper = createColumnHelper<Payment>();

	const columnsOther: ColumnDef<Payment>[] = [
		{
			accessorKey: "id",
			header: "",
			enableSorting: false,
			cell: (val) => flexRender(DataTableActions, { id: val.getValue() }),
			size: 1,
		},
		{
			accessorKey: "id",
			header: () => "Id",
		},
		{
			accessorKey: "status",
			header: () => "Status",
			cell: (te) => flexRender(Badge, { name: te.getValue(), slot: flexRender("test", te.cell.getContext()) }),
		},
		{
			accessorKey: "email",
			header: () => "Email",
		},
		{
			accessorKey: "amount",
			header: "Amount",
		},
	];
</script>

<DataTable columns={columnsOther} {data} />
