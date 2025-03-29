<script lang="ts" generics="T">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Button } from "$lib/components/ui/button";
	import { Settings2Icon } from "@lucide/svelte";
	import type { Table } from "@tanstack/table-core";

	interface Props<T> {
		table: Table<T>;
	}

	let { table }: Props<T> = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button variant="outline" size="sm">
			<Settings2Icon class="mr-2 h-4 w-4" /> View
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each table.getAllLeafColumns() as column}
			<DropdownMenu.CheckboxItem checked={column.getIsVisible()} onCheckedChange={() => column.toggleVisibility()}>
				{column.id}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
