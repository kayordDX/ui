<script lang="ts" generics="T">
	import { FlexRender, Table } from "$lib";
	import { type Header, type Table as TypeType } from "@tanstack/table-core";

	interface Props<T> {
		table: TypeType<T>;
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
	<Table.Footer class="bg-muted/10 border-t-1 font-bold">
		{#each table.getFooterGroups() as footerGroup}
			<Table.Row>
				{#each footerGroup.headers as header}
					<Table.Cell colspan={header.colSpan}>
						{#if !header.isPlaceholder}
							<FlexRender content={header.column.columnDef.footer} context={header.getContext()} />
						{/if}
					</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Footer>
{/if}
