<script lang="ts">
	import { writable } from "svelte/store";
	import { createSvelteTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, renderComponent } from "@tanstack/svelte-table";
	import type { ColumnDef, TableOptions, ColumnSort, SortingState, OnChangeFn } from "@tanstack/svelte-table";
	import { Button, DropdownMenu, Select, Table } from "$lib";
	import { ArrowBigLeft, ArrowBigRight, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown } from "lucide-svelte";

	type T = $$Generic;

	export let columns: ColumnDef<T>[];
	export let data: T[];

	let sorting: SortingState = [];

	const setSorting = (updater: any) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting,
			},
		}));
		return sorting;
	};

	const options = writable<TableOptions<T>>({
		data,
		columns,
		state: {
			sorting,
		},
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		debugTable: true,
	});

	const table = createSvelteTable(options);
</script>

<div class="rounded-md border m-2">
	<Table.Root class="caption-top table-auto">
		<Table.Caption>A list of your recent invoices.</Table.Caption>
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
		<Table.Body>
			{#each $table.getRowModel().rows as row}
				<Table.Row>
					{#each row.getVisibleCells() as cell}
						<Table.Cell>
							<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Footer>
			{#each $table.getFooterGroups() as footerGroup}
				<Table.Row></Table.Row>
			{/each}
		</Table.Footer>
	</Table.Root>
	<div class="flex items-center justify-between px-2 py-2">
		<div class="flex w-[100px] items-center justify-center text-sm font-medium">
			Page {$table.getState().pagination.pageIndex + 1} of {$table.getPageCount()}
		</div>
		<div class="flex items-center space-x-2">
			<p class="text-sm font-medium">Rows per page</p>
			<Select.Root onSelectedChange={(selected) => $table.setPageSize(Number(selected?.value))} selected={{ value: 10, label: "10" }}>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Select page size" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="10">10</Select.Item>
					<Select.Item value="20">20</Select.Item>
					<Select.Item value="30">30</Select.Item>
					<Select.Item value="40">40</Select.Item>
					<Select.Item value="50">50</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		<div class="flex items-center space-x-2">
			<Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" on:click={() => $table.setPageIndex(0)} disabled={!$table.getCanPreviousPage()}>
				<span class="sr-only">Go to first page</span>
				<ArrowBigLeft size={15} />
			</Button>
			<Button variant="outline" class="p-0 w-8 h-8" on:click={() => $table.setPageIndex($table.getState().pagination.pageIndex - 1)} disabled={!$table.getCanPreviousPage()}>
				<span class="sr-only">Go to previous page</span>
				<ArrowLeft size={15} />
			</Button>
			<Button variant="outline" class="p-0 w-8 h-8" disabled={!$table.getCanNextPage()} on:click={() => $table.setPageIndex($table.getState().pagination.pageIndex + 1)}>
				<span class="sr-only">Go to next page</span>
				<ArrowRight size={15} />
			</Button>
			<Button variant="outline" class="hidden h-8 w-8 p-0 lg:flex" disabled={!$table.getCanNextPage()} on:click={() => $table.setPageIndex($table.getPageCount() - 1)}>
				<span class="sr-only">Go to last page</span>
				<ArrowBigRight size={15} />
			</Button>
		</div>
	</div>
</div>

<div class="my-24">Other</div>
