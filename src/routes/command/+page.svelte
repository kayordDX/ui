<script lang="ts">
	import { Card, Command } from "$lib/components/ui";
	import TreeItem from "./TreeItem.svelte";
	let myValue = $state("");

	const data = [
		{
			id: 1,
			name: "Drinks",
			parentId: null,
		},
		{
			id: 2,
			name: "Food",
			parentId: null,
		},
		{
			id: 3,
			name: "Burger",
			parentId: 2,
		},
		{
			id: 4,
			name: "Pizza",
			parentId: 2,
		},
		{
			id: 5,
			name: "Hawain",
			parentId: 4,
		},
	];

	// Define interfaces for the data items and tree nodes
	interface DataItem {
		id: number;
		name: string;
		parentId: number | null;
	}

	interface TreeNode extends DataItem {
		children?: TreeNode[];
	}

	function convertDataToNestedArray(items: DataItem[], parentId: number | null = null): TreeNode[] {
		return items
			.filter((item) => item.parentId === parentId)
			.map((item) => {
				const children = convertDataToNestedArray(items, item.id);
				const node: TreeNode = { ...item };
				if (children.length > 0) {
					node.children = children;
				}
				return node;
			});
	}

	const nestedData = convertDataToNestedArray(data);
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Command</Card.Title>
		<Card.Description>{myValue}</Card.Description>
	</Card.Header>
	<Card.Content>
		<Command.Root class="rounded-lg border shadow-md" bind:value={myValue} disablePointerSelection>
			<Command.Input placeholder="Type a command or search..." />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				{#each nestedData as item}
					<TreeItem {...item} />
				{/each}
			</Command.List>
		</Command.Root>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Nested Data Structure</Card.Title>
	</Card.Header>
	<Card.Content><pre>{JSON.stringify(nestedData, null, 2)}</pre></Card.Content>
</Card.Root>
