<script lang="ts">
	import { DataTable, createShadTable, useTableUrlSync, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import Input from "$lib/components/ui/input/input.svelte";
	import { Button } from "$lib";

	interface Todo {
		userId: number;
		id: number;
		title: string;
		completed: boolean;
	}

	let data = $state<Todo[]>([]);
	let rowCount = $derived(data.length ?? 0);
	let isLoading = $state(true);

	const fetchData = async () => {
		isLoading = true;
		const res = await fetch("https://jsonplaceholder.typicode.com/todos");
		const json = await res.json();
		data = json;
		isLoading = false;
	};

	$effect(() => {
		fetchData();
	});

	const columns: ColumnDef<DataTableFeatures, Todo>[] = [
		{
			accessorKey: "userId",
			header: "UserId",
			maxSize: 10,
		},
		{
			header: "id",
			accessorKey: "id",
			size: 10,
			minSize: 150,
		},
		{
			accessorKey: "title",
			cell: (info) => info.getValue(),
			size: 100000,
		},
		{
			header: "completed",
			accessorKey: "completed",
			size: 100,
			minSize: 150,
		},
	];

	// Uncontrolled table — state lives in the table's atoms.
	const table = createShadTable({
		columns,
		get data() {
			return data;
		},
		get rowCount() {
			return rowCount;
		},
		enableRowSelection: true,
		manualPagination: true,
		manualFiltering: true,
		autoResetPageIndex: false,
	});

	useTableUrlSync(table);

	const globalFilter = $derived(table.atoms.globalFilter.get() ?? "");
	const sorting = $derived(table.atoms.sorting.get());
</script>

{JSON.stringify(sorting)}
<div>
	test:
	{globalFilter}
</div>
<div class="m-2">
	<Button onclick={() => table.setGlobalFilter("b")}>Set</Button>
	<Button onclick={() => table.setColumnFilters([{ id: "test", value: "test" }])}>Set Column Filter</Button>
	<Input value={globalFilter} oninput={(e) => table.setGlobalFilter(e.currentTarget.value)} />
	<DataTable {table} headerClass="mt-2" {isLoading} />
</div>
