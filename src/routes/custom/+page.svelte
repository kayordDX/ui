<script lang="ts">
	import { Loader, LightSwitch, Actions, ThemeSelector, NumberTicker } from "$lib";
	import ProgressLoading from "$lib/components/custom/progress-loading/ProgressLoading.svelte";
	import { Button, Card } from "$lib/components/ui";
	import { HomeIcon, MoreHorizontalIcon } from "@lucide/svelte";

	let isLoading = $state(true);
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Loader</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="w-10">
			<Loader {isLoading} />
		</div>
		<Button onclick={() => (isLoading = !isLoading)}>Toggle Loading</Button>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>LightSwitch / Theme Selector</Card.Title>
	</Card.Header>
	<Card.Content>
		<LightSwitch />
		<ThemeSelector />
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>ProgressLoading</Card.Title>
	</Card.Header>
	<Card.Content>
		<ProgressLoading value={20} />
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Actions</Card.Title>
	</Card.Header>
	<Card.Content>
		<Actions
			actions={[
				{
					text: "Title",
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

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Number Ticker</Card.Title>
	</Card.Header>
	<Card.Content>
		<NumberTicker value={1000} duration={800} class="text-4xl font-bold" />
	</Card.Content>
</Card.Root>
