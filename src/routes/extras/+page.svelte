<script lang="ts">
	import { Card, TreeView } from "$lib";
	import { LayoutGridIcon } from "@lucide/svelte";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Tree</Card.Title>
	</Card.Header>
	<Card.Content>
		<TreeView.Root>
			<TreeView.Folder name="src">
				<TreeView.Folder name="routes">
					<TreeView.File name="+layout.svelte" onclick={() => console.log("layout")} />
					<TreeView.File name="+page.svelte" />
				</TreeView.Folder>
				<TreeView.File name="app.css">
					{#snippet icon({ name })}
						<LayoutGridIcon />
					{/snippet}
				</TreeView.File>
				<TreeView.File name="hooks.server.ts" />
			</TreeView.Folder>
		</TreeView.Root>
	</Card.Content>
</Card.Root>
