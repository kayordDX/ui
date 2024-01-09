<script lang="ts">
	import { ArrowDown, ArrowUp } from "lucide-svelte";

	import { Button, ProgressLoading, Skeleton } from "$lib";
	import { Subscribe, Render, type TableViewModel } from "svelte-headless-table";
	import * as Table from "$lib/components/ui/table";
	import * as Pagination from "$lib/components/ui/pagination";

	type RowData = Record<string, any>;
	type T = $$Generic<RowData>;
	export let tableViewModel: TableViewModel<T>;

	export let title: string = "";
	export let isLoading: boolean = false;
	export let hideHeader: boolean = false;

	export let noDataMessage: string | undefined = "No Data";
	export let serverItemCount: number | undefined = undefined;

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, rows, flatColumns } = tableViewModel;

	// Sorting
	const isSortEnabled = pluginStates.sort != undefined;
	const sortKeys = isSortEnabled ? pluginStates.sort.sortKeys : undefined;

	// Paging
	const isPagingEnabled = pluginStates.page != undefined;
	const pageIndex = isPagingEnabled ? pluginStates.page.pageIndex : undefined;
	const pageSize = isPagingEnabled ? pluginStates.page.pageSize : undefined;
</script>

<div class="w-full">
	<div class="rounded-md border m-2">
		{#if $$slots.header || title.length > 0}
			<div class="rounded-t-md overflow-hidden">
				{#if $$slots.header}
					<slot name="header" />
				{:else}
					<h1 class="text-lg text-center p-2">
						{title}
					</h1>
				{/if}
			</div>
		{/if}
		{#if $$slots.subHeader}
			<slot name="subHeader" />
		{/if}
		{#if isLoading}
			<ProgressLoading class="h-1" />
		{/if}
		<Table.Root {...$tableAttrs} class="table-auto">
			{#if !hideHeader}
				<Table.Header>
					{#each $headerRows as headerRow}
						<Subscribe rowAttrs={headerRow.attrs()}>
							<Table.Row>
								{#each headerRow.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
										<Table.Head {...attrs}>
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
				{#if isLoading}
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
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row {...rowAttrs}>
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
	</div>
	{#if isPagingEnabled}
		<Pagination.Root count={serverItemCount ?? $rows.length} perPage={$pageSize} let:pages let:currentPage>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton on:click={() => ($pageIndex = $pageIndex - 1)} />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === "ellipsis"}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage == page.value} on:click={() => ($pageIndex = page.value - 1)}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton on:click={() => ($pageIndex = $pageIndex + 1)} />
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	{/if}
	{#if $$slots.footer}
		<div class="rounded-b-md overflow-hidden">
			<slot name="footer" />
		</div>
	{/if}
</div>
