<script lang="ts">
	import { Button, Table } from "$lib";

	// Expand this data to be 50 rows
	const data: DataType[] = [];
	for (let i = 0; i < 50; i++) {
		data.push({
			id: i + 1,
			name: Array(Math.floor(Math.random() * 10) + 5)
				.fill("")
				.map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
				.join(""),
		});
	}

	interface DataType {
		id: number;
		name: string;
	}

	import {
		type ColumnDef,
		FlexRender,
		createTable,
		getCoreRowModel,
		renderComponent,
		type Table as TableType,
		type VisibilityState,
		type OnChangeFn,
		type Updater,
		type PaginationState,
		getPaginationRowModel,
	} from "@tanstack/svelte-table";
	import ViewOptions from "./view-options.svelte";
	import Pagination from "./pagination.svelte";

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			cell: (info) => info.getValue(),
			enableHiding: false,
		},
		{
			accessorKey: "name",
			cell: (info) => info.getValue(),
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

	let pagination: PaginationState = $state({ pageIndex: 0, pageSize: 15 });

	function setPagination(updater: Updater<PaginationState>) {
		if (updater instanceof Function) {
			pagination = updater(pagination);
		} else pagination = updater;
	}

	const table = createTable({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		state: {
			get pagination() {
				return pagination;
			},
			get columnVisibility() {
				return columnVisibility;
			},
		},
		onColumnVisibilityChange: setVisibility,
		onPaginationChange: setPagination,
		initialState: {
			pagination: {
				pageIndex: 1,
			},
		},
	});

	$effect(() => {
		console.log("table", table);
	});
</script>

<ViewOptions {table} />
<div class="m-4 rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup}
				<Table.Row>
					{#each headerGroup.headers as header}
						<Table.Head colspan={header.colSpan}>
							{#if !header.isPlaceholder}
								<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#if table.getRowModel().rows.length}
				{#each table.getRowModel().rows as row}
					<Table.Row data-state={row.getIsSelected() && "selected"}>
						{#each row.getVisibleCells() as cell}
							<Table.Cell>
								<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			{:else}
				<Table.Row>
					<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
				</Table.Row>
			{/if}
		</Table.Body>
	</Table.Root>
</div>
<Pagination {table} />

<Button onclick={() => table.nextPage()}>Test</Button>

<div>
	{table.getState().pagination.pageSize}
	{table.getState().pagination.pageIndex}
</div>
