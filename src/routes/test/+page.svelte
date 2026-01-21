<script lang="ts">
	import { Button, Card } from "$lib";
	import type { ColumnDef } from "@tanstack/table-core";
	import DataGrid from "$lib/components/custom/data-grid/DataGrid.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import { createGrid } from "$lib/components/custom/data-grid/createGrid.svelte";

	type Employee = {
		id: string;
		name: string;
		email: string;
		age: number;
		department: string;
		startDate: string;
		isActive: boolean;
	};

	let data = $state<Employee[]>([
		{
			id: "1",
			name: "John Doe",
			email: "john@example.com",
			age: 32,
			department: "Engineering",
			startDate: "2022-03-15",
			isActive: true,
		},
	]);

	const addData = () => {
		data = [
			{
				id: "1",
				name: "John Doe",
				email: "john@example.com",
				age: 32,
				department: "Engineering",
				startDate: "2022-03-15",
				isActive: true,
			},
			{
				id: "2",
				name: "Jane Smith",
				email: "jane@example.com",
				age: 28,
				department: "Marketing",
				startDate: "2021-07-22",
				isActive: true,
			},
			{
				id: "3",
				name: "Bob Johnson",
				email: "bob@example.com",
				age: 45,
				department: "Sales",
				startDate: "2019-11-08",
				isActive: false,
			},
			{
				id: "4",
				name: "Alice Williams",
				email: "alice@example.com",
				age: 35,
				department: "HR",
				startDate: "2020-05-30",
				isActive: true,
			},
			{
				id: "5",
				name: "Charlie Brown",
				email: "charlie@example.com",
				age: 29,
				department: "Finance",
				startDate: "2023-01-10",
				isActive: true,
			},
			{
				id: "6",
				name: "Diana Ross",
				email: "diana@example.com",
				age: 41,
				department: "Engineering",
				startDate: "2018-09-14",
				isActive: true,
			},
			{
				id: "7",
				name: "Edward Chen",
				email: "edward@example.com",
				age: 33,
				department: "Marketing",
				startDate: "2021-02-28",
				isActive: false,
			},
			{
				id: "8",
				name: "Fiona Garcia",
				email: "fiona@example.com",
				age: 27,
				department: "Sales",
				startDate: "2022-08-05",
				isActive: true,
			},
			{
				id: "9",
				name: "George Wilson",
				email: "george@example.com",
				age: 52,
				department: "HR",
				startDate: "2017-04-18",
				isActive: true,
			},
			{
				id: "10",
				name: "Hannah Lee",
				email: "hannah@example.com",
				age: 31,
				department: "Finance",
				startDate: "2020-12-01",
				isActive: true,
			},
			{
				id: "11",
				name: "Ian Thompson",
				email: "ian@example.com",
				age: 38,
				department: "Engineering",
				startDate: "2019-06-12",
				isActive: true,
			},
			{
				id: "12",
				name: "Julia Martinez",
				email: "julia@example.com",
				age: 26,
				department: "Marketing",
				startDate: "2022-11-03",
				isActive: true,
			},
			{
				id: "13",
				name: "Kevin Davis",
				email: "kevin@example.com",
				age: 50,
				department: "Sales",
				startDate: "2016-09-25",
				isActive: false,
			},
			{
				id: "14",
				name: "Laura Anderson",
				email: "laura@example.com",
				age: 34,
				department: "HR",
				startDate: "2021-04-17",
				isActive: true,
			},
			{
				id: "15",
				name: "Mike Taylor",
				email: "mike@example.com",
				age: 42,
				department: "Finance",
				startDate: "2018-07-08",
				isActive: true,
			},
			{
				id: "16",
				name: "Nina Rodriguez",
				email: "nina@example.com",
				age: 29,
				department: "Engineering",
				startDate: "2023-02-14",
				isActive: true,
			},
			{
				id: "17",
				name: "Oscar White",
				email: "oscar@example.com",
				age: 47,
				department: "Marketing",
				startDate: "2017-10-30",
				isActive: false,
			},
			{
				id: "18",
				name: "Paula Harris",
				email: "paula@example.com",
				age: 31,
				department: "Sales",
				startDate: "2020-08-19",
				isActive: true,
			},
			{
				id: "19",
				name: "Quinn Clark",
				email: "quinn@example.com",
				age: 36,
				department: "HR",
				startDate: "2019-12-05",
				isActive: true,
			},
			{
				id: "20",
				name: "Rachel Lewis",
				email: "rachel@example.com",
				age: 44,
				department: "Finance",
				startDate: "2015-03-22",
				isActive: true,
			},
		];
	};

	const columns: ColumnDef<Employee>[] = [
		{
			accessorKey: "name",
			header: "Name",
			size: 1000,
		},
		{
			accessorKey: "email",
			header: "Email",
			size: 1,
		},
		{
			accessorKey: "age",
			header: "Age",
		},
		{
			accessorKey: "department",
			header: "Department",
		},
		{
			accessorKey: "startDate",
			header: "Start Date",
		},
		{
			accessorKey: "isActive",
			header: "Active",
			enableSorting: false,
		},
	];

	// let rowSelection: RowSelectionState = $state({});

	let rc = $state(100);

	const { table, dataGridProps } = createGrid({
		columns,
		data: () => data,
		dataGridProps: {
			useURLSearchParams: true,
			manualPagination: true,
			rowCount: () => rc,
		},
	});

	// const what = createShadTable({
	// 	columns,
	// 	data,
	// 	enableRowSelection: true,
	// });

	// table.setGlobalFilter("John Doe");
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Test</Card.Title>
		{rc}
	</Card.Header>
	<Card.Content>
		<!-- Test<Input bind:value={params.test} /> -->
		<Input bind:value={() => table.getState().globalFilter, (v) => table.setGlobalFilter(v)} />
		<!-- <DataTable table={what} headerClass="mt-2" /> -->
		<DataGrid {table} {dataGridProps} headerClass="mt-2" enableVisibility />
		<Button onclick={() => table.setColumnFilters([{ id: "name", value: "John" }])}>Filter 1</Button>
		<Button onclick={() => table.resetColumnFilters()}>Reset</Button>
		<Button onclick={() => table.setGlobalFilter("z")}>Global Filter</Button>
		<Button onclick={() => table.resetGlobalFilter()}>Reset Global</Button>
		<Button onclick={() => (rc = 1)}>RC</Button>
		<Button onclick={addData}>Add Data</Button>
	</Card.Content>
</Card.Root>
