<script lang="ts">
	interface DataType {
		id: number;
		name: string;
	}

	import { getCoreRowModel, type ColumnDef } from "@tanstack/table-core";

	import { data } from "./data.svelte";
	import { Button, createShadTable, createSvelteTable, DataTable } from "$lib";

	const what = $derived(data.value);

	$effect(() => {
		console.log(what);
	});

	let monkey = $state(["test"]);

	const columns: ColumnDef<DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			maxSize: 10,
		},
		{
			accessorKey: "name",
			cell: (info) => info.getValue(),
			size: 100000,
		},
		{
			header: "Day",
			accessorKey: "day",
			size: 100,
			minSize: 150,
		},
	];

	const table = createSvelteTable({
		columns,
		get data() {
			return data.value;
		},
		getCoreRowModel: getCoreRowModel(),
		enableRowSelection: false,
	});
	const addRecord = () => {
		// data.value = [...data.value, { day: "1", id: 99, name: "1" }];
		// data.value.push({ day: "1", id: 99, name: "1" });
		// monkey = [...monkey, "another"];
		monkey.push("another");
		monkey = monkey;
	};

	$effect(() => {
		console.log(monkey);
	});

	$inspect(data.value);

	const realData = $derived(data.value);

	$inspect(realData);
	$inspect(monkey);
</script>

<DataTable {table} {columns} headerClass="mt-2" enableVisibility />
{#each data.value as value}
	<span>{value.id}</span>
{/each}

<Button onclick={addRecord}>Add Record</Button>
{monkey}
