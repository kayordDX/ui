<script lang="ts">
	import { DataTableActions } from "$lib/components/custom/data-table";
	import { Badge } from "$lib";
	import { data, type Payment } from "$lib/components/custom/data-table/data";
	import { DataTable } from "$lib/components/custom/data-table";
	import { flexRender, type ColumnDef, createColumnHelper } from "@tanstack/svelte-table";

	const columnHelper = createColumnHelper<Payment>();
	columnHelper.accessor("id", { header: "", enableSorting: false, cell: (val) => flexRender(DataTableActions, { id: val.getValue() }), size: 1 });
	const columns2 = [
		columnHelper.accessor("amount", {
			header: "Last Name",
		}),
	];

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

<DataTable columns={columnsOther} {data} title="The world is ending" isLoading={false}>
	<!-- <div slot="header" class="bg-muted text-center p-2 text-xl font-bold"><h1>Title</h1></div> -->
	<!-- <div slot="subHeader" class="bg-red-500">test</div> -->
</DataTable>
