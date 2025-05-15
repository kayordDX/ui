<script lang="ts">
	import { Command } from "$lib";
	const { id, name, parentId, children }: TreeNode = $props();
	import TreeItem from "./TreeItem.svelte";
</script>

<!-- <div>
	<span>{name}</span>
	{#if children}
		<div class="pl-4">
			{#each children as child}
				<TreeItem {...child} />
			{/each}
		</div>
	{/if}
</div> -->

<Command.Item value={id.toString()} keywords={[name]}>
	<span>{name}</span>
</Command.Item>
{#if children}
	<Command.Group heading={name}>
		{#each children as child}
			<TreeItem {...child} />
		{/each}
	</Command.Group>
{/if}
