<script lang="ts">
	interface DataType {
		id: number;
		name: string;
		day: string;
		joined: Date;
		tags: string[];
	}

	import type { ColumnFiltersState } from "@tanstack/svelte-table";
	import { DataTable, createShadTable, type ColumnDef, type DataTableFeatures } from "$lib/data-table";
	import { fromQueryKitFilter, toQueryKitFilter, toQueryKitSort } from "$lib/query-kit";
	import { Input } from "$lib/components/ui/input";

	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	const rows: DataType[] = Array.from({ length: 30 }, (_, i) => ({
		id: i + 1,
		name: ["alice", "bob", "charlie", "dave", "eve"][i % 5],
		day: days[i % 7],
		joined: new Date(Date.UTC(2025, i % 12, (i % 27) + 1)),
		tags: [["admin"], ["admin", "editor"], ["viewer"]][i % 3],
	}));

	const columns: ColumnDef<DataTableFeatures, DataType>[] = [
		{
			accessorKey: "id",
			header: "ID",
			meta: { variant: "number" },
		},
		{
			accessorKey: "name",
			header: "Name",
			meta: { label: "Name" },
		},
		{
			accessorKey: "day",
			header: "Day",
			meta: {
				variant: "select",
				options: days.map((day) => ({ label: day, value: day })),
			},
		},
		{
			accessorKey: "joined",
			header: "Joined",
			meta: { variant: "date" },
		},
		{
			accessorKey: "tags",
			header: "Tags",
			meta: { variant: "multi-select" },
		},
	];

	const table = createShadTable({
		columns,
		data: rows,
		enableRowSelection: false,
	});

	const queryString = $derived(toQueryKitFilter(table.atoms.columnFilters.get()));
	const sortString = $derived(toQueryKitSort(table.atoms.sorting.get()));

	function applyQuery(input: string) {
		table.options.onColumnFiltersChange?.(fromQueryKitFilter(input) as ColumnFiltersState);
	}
</script>

<DataTable {table} enableFilters enableQueryKitFilters headerClass="mt-2" />

<div class="mt-4 flex flex-col gap-2">
	<Input
		placeholder="Paste a QueryKit filter, e.g. Name @=* alice && Id > 10"
		oninput={(event) => applyQuery(event.currentTarget.value)}
	/>
	<pre class="bg-muted/40 rounded-md border p-2 font-mono text-xs">{queryString || "(no active filters)"}</pre>
	<pre class="bg-muted/40 rounded-md border p-2 font-mono text-xs">sort: {sortString || "(none)"}</pre>
</div>
