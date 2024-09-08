<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import {
		type ColumnDef,
		createTable,
		getCoreRowModel,
		type VisibilityState,
		type Updater,
		type PaginationState,
		getPaginationRowModel,
		renderComponent,
		FlexRender,
	} from "@tanstack/svelte-table";
	import { getData } from "./data";
	import DataTable from "$lib/components/custom/new-data-table/DataTable.svelte";
	import { Badge } from "$lib";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			cell: (info) => info.getValue(),
			enableHiding: false,
		},
		{
			accessorKey: "name",
			// cell: (info) => info.getValue(),
			cell: ({ getValue }) => {
				let color: string | undefined = undefined;
				return renderComponent(Badge, { variant: "outline", value: "test" });
				// return renderComponent(Badge, { data: getValue(), $$slots: { default: () => "Test", value: "test" } });
				// return createRawSnippet("<div>Test</div>", {	});
			},
		},
	];

	let columnVisibility: VisibilityState = $state({});

	const visibilityChange = (state: Updater<VisibilityState>) => {
		console.log("change", state);
	};

	const setVisibility = (updater: Updater<VisibilityState>) => {
		if (updater instanceof Function) {
			columnVisibility = updater(columnVisibility);
		} else columnVisibility = updater;
	};

	let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 10 });

	const setPagination = (updater: Updater<PaginationState>) => {
		if (updater instanceof Function) {
			pagination = updater(pagination);
		} else pagination = updater;
	};

	// const data = getData();
	const data = getData();

	const table = createTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			get pagination() {
				return pagination;
			},
			// get columnVisibility() {
			// 	return columnVisibility;
			// },
		},
		// onColumnVisibilityChange: setVisibility,
		onPaginationChange: setPagination,
	});
</script>

{#snippet MyThing()}
	<Badge>Test</Badge>
{/snippet}

{#snippet header()}
	<div class="text-center">🚀</div>
{/snippet}

<div class="m-4">
	<DataTable {table} {columns} title="Test" />
</div>
