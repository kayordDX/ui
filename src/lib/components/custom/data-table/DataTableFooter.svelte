<script lang="ts">
	import type { Table as TableType } from "@tanstack/svelte-table";
	import { Table } from "$lib";
	import type { Readable } from "svelte/store";

	type T = $$Generic<MRT_RowData>;
	export let table: Readable<TableType<T>>;
</script>

<Table.Footer>
	{#each $table.getFooterGroups() as footerGroup}
		<Table.Row></Table.Row>
	{/each}
</Table.Footer>
