<script lang="ts">
	import ArrowDown from "lucide-svelte/icons/arrow-down";
	import ArrowUp from "lucide-svelte/icons/arrow-up";
	import { fade } from "svelte/transition";

	import { Button, ProgressLoading, Skeleton } from "$lib";
	import { Subscribe, Render, type TableViewModel } from "svelte-headless-table";
	import * as Table from "$lib/components/ui/table";
	import DataTablePagination from "./DataTablePagination.svelte";

	type RowData = Record<string, any>;
	type T = $$Generic<RowData>;
	export let tableViewModel: TableViewModel<T>;

	export let title: string = "";
	export let isLoading: boolean = false;
	export let hideHeader: boolean = false;

	export let noDataMessage: string | undefined = "No Data";
	export let serverItemCount: number | undefined = undefined;

	export let rowAction: ((row: T | undefined) => void) | undefined = undefined;

	export let showSelected: boolean = true;
	export let showRowsPerPage: boolean = false;

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows, flatColumns } = tableViewModel;

	// Sorting
	const isSortEnabled = pluginStates.sort != undefined;
	const sortKeys = isSortEnabled ? pluginStates.sort.sortKeys : undefined;

	// Paging
	const isPagingEnabled = pluginStates.page != undefined;
	const pageIndex = isPagingEnabled ? pluginStates.page.pageIndex : undefined;
	const pageSize = isPagingEnabled ? pluginStates.page.pageSize : undefined;

	// Select
	const isSelectEnabled = pluginStates.select != undefined;
	const selectedDataIds = isSelectEnabled ? pluginStates.select.selectedDataIds : undefined;

	const getOriginalData = (id: any) => {
		const data = $pageRows[id] as unknown as { original: T };
		return data.original;
	};
</script>

<div class="w-full">
	<div class="m-2 rounded-md border">
		{#if isLoading}
			<span in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1" />
			</span>
		{:else}
			<div class="h-1"></div>
		{/if}
		{#if $$slots.header || title.length > 0}
			<div class="overflow-hidden rounded-t-md">
				{#if $$slots.header}
					<slot name="header" />
				{:else}
					<h1 class="p-2 text-center text-lg">
						{title}
					</h1>
				{/if}
			</div>
		{/if}
		{#if $$slots.subHeader}
			<slot name="subHeader" />
		{/if}
		<Table.Root {...$tableAttrs} class="table-auto">
			{#if !hideHeader}
				<Table.Header>
					{#each $headerRows as headerRow}
						<Subscribe rowAttrs={headerRow.attrs()}>
							<Table.Row>
								{#each headerRow.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
										<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-4">
											{#if isSortEnabled}
												<Button variant="ghost" on:click={props.sort.toggle}>
													<Render of={cell.render()} />
													{#each $sortKeys as sortKey}
														{#if sortKey?.id === cell.id && sortKey?.order == "desc"}
															<ArrowDown class="ml-2 h-4 w-4" />
														{:else if sortKey?.id === cell.id && sortKey?.order === "asc"}
															<ArrowUp class="ml-2 h-4 w-4" />
														{/if}
													{/each}
												</Button>
											{:else}
												<Render of={cell.render()} />
											{/if}
										</Table.Head>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Header>
			{/if}
			<Table.Body {...$tableBodyAttrs}>
				{#if isLoading && $rows.length == 0}
					{#each { length: 5 } as _, i}
						<Table.Row>
							{#each flatColumns as cell}
								<Table.Cell>
									<Skeleton class="h-4" />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					{#if $rows.length == 0}
						<Table.Row>
							<Table.Cell colspan={flatColumns.length}>
								<div class="text-center">{noDataMessage}</div>
							</Table.Cell>
						</Table.Row>
					{/if}
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs rowProps={row.props()} let:rowProps>
							<Table.Row
								{...rowAttrs}
								data-state={isSelectEnabled && rowProps.select.selected ? "selected" : "false"}
								class={rowAction == undefined ? "" : "hover:cursor-pointer"}
								on:click={() => (rowAction != undefined ? rowAction(getOriginalData(row.id)) : undefined)}
							>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											<Render of={cell.render()} />
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
		{#if isLoading}
			<span in:fade={{ duration: 300 }}>
				<ProgressLoading class="h-1" />
			</span>
		{/if}
	</div>
	<div class="flex items-center">
		<div class="flex-1 px-2 text-sm text-muted-foreground">
			{#if isSelectEnabled && showSelected}
				{Object.keys($selectedDataIds).length} of {serverItemCount ?? $rows.length} row(s) selected.
			{/if}
		</div>
		{#if isPagingEnabled}
			<DataTablePagination tableModel={tableViewModel} {showRowsPerPage} />
		{/if}
	</div>

	{#if $$slots.footer}
		<div class="overflow-hidden rounded-b-md">
			<slot name="footer" />
		</div>
	{/if}
</div>
