<script lang="ts">
	import { Card, TreeView, LightSwitch, ThemeSelector, InputOTP } from "$lib";
	import { LayoutGridIcon } from "@lucide/svelte";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Test</Card.Title>
	</Card.Header>
	<InputOTP.Root maxlength={6}>
		{#snippet children({ cells })}
			<InputOTP.Group>
				{#each cells.slice(0, 3) as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
			<InputOTP.Separator />
			<InputOTP.Group>
				{#each cells.slice(3, 6) as cell (cell)}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>
	<LightSwitch />
	<ThemeSelector />
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
