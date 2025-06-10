<script lang="ts">
	import { Loader, LightSwitch, Actions, ThemeSelector, NumberTicker, AvatarGroup } from "$lib";
	import ProgressLoading from "$lib/components/custom/progress-loading/ProgressLoading.svelte";
	import { Button, Card } from "$lib/components/ui";
	import { HomeIcon, MoreHorizontalIcon } from "@lucide/svelte";

	let isLoading = $state(true);

	const members = [
		{
			username: "huntabyte",
			image: "https://github.com/huntabyte.png",
		},
		{
			username: "AdrianGonz97",
			image: "https://github.com/AdrianGonz97.png",
		},
		{
			username: "shyakadavis",
			image: "https://github.com/shyakadavis.png",
		},
		{
			username: "Another Day",
		},
	];
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

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Avatar Group</Card.Title>
	</Card.Header>
	<Card.Content>
		<AvatarGroup.Root>
			{#each members as member (member.username)}
				<AvatarGroup.Member>
					<AvatarGroup.MemberImage src={member.image} alt={member.username} />
					<AvatarGroup.MemberFallback>
						{member.username[0]}
					</AvatarGroup.MemberFallback>
				</AvatarGroup.Member>
			{/each}
			<AvatarGroup.Etc plus={2} />
		</AvatarGroup.Root>
	</Card.Content>
</Card.Root>
