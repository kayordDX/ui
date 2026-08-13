<script lang="ts" generics="T extends RowData">
	import { Table } from "$lib";
	import { FlexRender } from "$lib/components/ui/data-table";
	import type { RowData, Table as TanstackTable } from "@tanstack/svelte-table";
	import type { DataTableFeatures } from "./features";

	interface Props<T extends RowData> {
		table: TanstackTable<DataTableFeatures, T>;
	}

	let { table }: Props<T> = $props();

	const hasFooterContent = $derived(
		table
			.getFooterGroups()
			.some((footerGroup) =>
				footerGroup.headers.some((header) => !header.isPlaceholder && header.column.columnDef.footer)
			)
	);
</script>

{#if hasFooterContent}
	<Table.Footer class="bg-muted/20 border-t-1 font-bold">
		{#each table.getFooterGroups() as footerGroup (footerGroup.id)}
			<Table.Row>
				{#each footerGroup.headers as header (header.id)}
					<Table.Cell colspan={header.colSpan}>
						{#if !header.isPlaceholder}
							<FlexRender footer={header} />
						{/if}
					</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Footer>
{/if}
