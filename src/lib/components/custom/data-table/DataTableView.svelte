<script lang="ts" generics="TData extends RowData">
	import type { RowData, Table } from "@tanstack/svelte-table";
	import { cn } from "$lib/utils.js";
	import { Button } from "$lib/components/ui/button";
	import { Popover, PopoverContent, PopoverTrigger } from "$lib/components/ui/popover";
	import {
		Command,
		CommandEmpty,
		CommandGroup,
		CommandInput,
		CommandItem,
		CommandList,
	} from "$lib/components/ui/command/index.js";
	import type { DataTableFeatures } from "./features";

	// Icons
	import Settings2 from "@lucide/svelte/icons/settings-2";
	import Check from "@lucide/svelte/icons/check";

	interface Props {
		table: Table<DataTableFeatures, TData>;
		align?: "start" | "center" | "end";
		class?: string;
	}

	let { table, align = "start", class: className }: Props = $props();

	// Get columns - table.getAllColumns() is rune-reactive in v9
	const columns = $derived(
		table.getAllColumns().filter((column) => typeof column.accessorFn !== "undefined" && column.getCanHide())
	);

	// Get visibility state reactively via the v9 atoms API
	const columnVisibility = $derived(table.atoms.columnVisibility.get());

	// Helper to check if column is visible - reads from reactive state
	function isColumnVisible(columnId: string): boolean {
		// If not in visibility state, default to visible (true)
		return columnVisibility[columnId] !== false;
	}
</script>

<Popover>
	<PopoverTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				aria-label="Toggle columns"
				role="combobox"
				variant="outline"
				size="sm"
				class={cn("ml-auto hidden h-8 font-normal lg:flex", className)}
			>
				<Settings2 class="text-muted-foreground" />
				View
			</Button>
		{/snippet}
	</PopoverTrigger>
	<PopoverContent {align} class="w-44 p-0">
		<Command>
			<CommandInput placeholder="Search columns..." />
			<CommandList>
				<CommandEmpty>No columns found.</CommandEmpty>
				<CommandGroup>
					{#each columns as column (column.id)}
						{@const isVisible = isColumnVisible(column.id)}
						<CommandItem value={column.id} onSelect={() => column.toggleVisibility(!isVisible)}>
							<span class="truncate">
								{column.id}
							</span>
							<Check class={cn("ml-auto size-4 shrink-0", isVisible ? "opacity-100" : "opacity-0")} />
						</CommandItem>
					{/each}
				</CommandGroup>
			</CommandList>
		</Command>
	</PopoverContent>
</Popover>
