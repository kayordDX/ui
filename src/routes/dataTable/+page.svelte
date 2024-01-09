<script lang="ts">
	import { Badge, cn } from "$lib";
	import { data } from "$lib/components/custom/data-table/data";
	import { createRender, createTable, Render } from "svelte-headless-table";
	import { addHiddenColumns, addPagination, addSelectedRows, addSortBy, addTableFilter } from "svelte-headless-table/plugins";
	import { readable, writable } from "svelte/store";
	import { DataTable } from "$lib/index";
	import DataTableActions from "$lib/components/custom/data-table/DataTableActions.svelte";

	const serverCount = readable(1);

	const table = createTable(readable(data), {
		// sort: addSortBy({ serverSide: true }),
		// sort: addSortBy({ disableMultiSort: true }),
		// page: addPagination({ serverSide: true, serverItemCount: serverCount }),
		page: addPagination(),
		// filter: addTableFilter({
		// 	fn: ({ filterValue, value }) => value.includes(filterValue),
		// }),
		// select: addSelectedRows(),
		// hide: addHiddenColumns(),
	});

	const columns = table.createColumns([
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

	const tableViewModel = table.createViewModel(columns);

	const { pluginStates } = tableViewModel;
	// const { pageCount, pageIndex } = pluginStates.page;
</script>

<DataTable title="The world is endings" isLoading={false} {tableViewModel} hideHeader={false} noDataMessage="You have nothring left">
	<!-- <div slot="header">Test</div> -->
</DataTable>
