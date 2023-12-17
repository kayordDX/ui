<script lang="ts">
	import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-svelte";

	import { flexRender, type Table as TableType } from "@tanstack/svelte-table";
	import { Button, DropdownMenu, Table } from "$lib";
	import type { Readable } from "svelte/store";

	type T = $$Generic<MRT_RowData>;
	export let table: Readable<TableType<T>>;
	export let isLoading: boolean = false;
</script>

<Table.Header>
	{#each $table.getHeaderGroups() as headerGroup}
		<Table.Row>
			{#each headerGroup.headers as header}
				<Table.Head style={`width: ${header.column.getSize()}px`}>
					{#if !header.isPlaceholder}
						{#if header.column.getCanSort()}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger asChild let:builder>
									<Button variant="ghost" builders={[builder]} class="-ml-3 h-8 data-[state=open]:bg-accent">
										<svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />

										{#if header.column.getIsSorted() === "desc"}
											<ArrowDown class="ml-2 h-4 w-4" />
										{:else if header.column.getIsSorted() === "asc"}
											<ArrowUp class="ml-2 h-4 w-4" />
										{:else}
											<ArrowUpDown class="ml-2 h-4 w-4" />
										{/if}
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="start">
									<DropdownMenu.Item on:click={header.column.getToggleSortingHandler()}>Asc</DropdownMenu.Item>
									<DropdownMenu.Item on:click={header.column.getToggleSortingHandler()}>Desc</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
						{/if}
					{/if}
				</Table.Head>
			{/each}
		</Table.Row>
	{/each}
</Table.Header>
