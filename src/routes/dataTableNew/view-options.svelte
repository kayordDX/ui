<script lang="ts" generics="T">
	import type { Table } from "@tanstack/svelte-table";
	import MixerHorizontalIcon from "lucide-svelte/icons/maximize";

	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	interface Props<T> {
		table: Table<T>;
	}

	let { table }: Props<T> = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="sm" class="ml-auto hidden h-8 lg:flex">
			<MixerHorizontalIcon class="mr-2 size-4" />
			View
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[150px]">
		<DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each table
			.getAllColumns()
			.filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide()) as column}
			<DropdownMenu.CheckboxItem
				class="capitalize"
				checked={column.getIsVisible()}
				onCheckedChange={(value) => column.toggleVisibility(!!value)}
			>
				{column.id}
			</DropdownMenu.CheckboxItem>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
