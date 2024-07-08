<script lang="ts">
	import { Badge } from "$lib";
	import { cn } from "$lib/utils";
	import { data, type Payment } from "$lib/components/custom/data-table/data";
	import { createRender, createTable } from "svelte-headless-table";
	import { addPagination, addSelectedRows } from "svelte-headless-table/plugins";
	import { readable, writable, type Writable } from "svelte/store";
	import { DataTable } from "$lib/index";
	import DataTableActions from "$lib/components/custom/data-table/DataTableActions.svelte";
	import DataTableCheckbox from "$lib/components/custom/data-table/DataTableCheckbox.svelte";

	let lazyData: Writable<Payment[]> = writable([]);

	$effect(() => {
		const timeout = setTimeout(() => {
			// lazyData = writable(data);
			lazyData.set(data);
		}, 500);
		return () => clearTimeout(timeout);
	});

	const table = createTable(lazyData, {
		// sort: addSortBy({ serverSide: true }),
		// sort: addSortBy({ disableMultiSort: true }),
		// page: addPagination({ serverSide: true, serverItemCount: serverCount }),
		page: addPagination({ serverSide: false, initialPageSize: 10 }),

		// filter: addTableFilter({
		// 	fn: ({ filterValue, value }) => value.includes(filterValue),
		// }),
		select: addSelectedRows(),
		// hide: addHiddenColumns(),
	});

	const columns = table.createColumns([
		table.column({
			accessor: "id",
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected,
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return createRender(DataTableCheckbox, { checked: isSelected });
			},
		}),
		table.column({
			header: "",
			accessor: ({ id }) => id,
			cell: (item) => {
				return createRender(DataTableActions, { id: item.value });
			},
			// plugins: {
			// 	sort: {
			// 		disable: true,
			// 	},
			// },
		}),

		table.column({
			header: "Status",
			accessor: "status",
			cell: ({ value }) => {
				let color: string | undefined = undefined;
				if (value == "failed") {
					color = "border-red-500";
				}
				if (value == "success") {
					color = "border-green-500";
				}
				return createRender(Badge, { variant: "outline", class: cn(color, "p-2") }).slot(value);
			},
			// plugins: { sort: { disable: true }, filter: { exclude: true } },
		}),
		// table.column({
		// 	header: "Email",
		// 	accessor: "email",
		// 	cell: ({ value }) => value.toLowerCase(),
		// }),
		table.column({
			header: "Amount",
			accessor: "amount",
		}),
	]);

	// This
	const tableViewModel = table.createViewModel(columns, { rowDataId: (row) => row.id });

	const { pluginStates } = tableViewModel;
	const { selectedDataIds } = pluginStates.select;
</script>

<DataTable
	title="The world is endings"
	isLoading={true}
	{tableViewModel}
	hideHeader={false}
	noDataMessage="You have nothring left"
	showSelected={true}
>
	<!-- <div slot="header">Test</div> -->
</DataTable>
