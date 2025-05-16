<script lang="ts">
	import { Button, Card, DropdownMenu } from "$lib";
	import Action from "$lib/components/custom/action/Action.svelte";
	import Actions from "$lib/components/custom/action/Actions.svelte";
	import { HomeIcon, MoreHorizontalIcon } from "@lucide/svelte";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Actions</Card.Title>
	</Card.Header>
	<Card.Content>
		<Actions
			actions={[
				{
					text: "Test",
					icon: HomeIcon,
					action: () => console.log("test"),
				},
				{
					text: "Another",
					icon: MoreHorizontalIcon,
					href: "/",
				},
			]}
			variant="outline"
		/>
		<Actions
			actions={[{ label: "test" }, {}, { text: "Test", icon: HomeIcon, action: () => console.log("test") }]}
			variant="outline"
		/>

		<Actions actions={[{ text: "Test", action: () => console.log("test") }]} />
	</Card.Content>
</Card.Root>
