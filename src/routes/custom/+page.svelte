<script lang="ts">
	import { Loader, LightSwitch, Actions, ThemeSelector, NumberTicker, AvatarGroup } from "$lib";
	import Meter from "$lib/components/custom/meter/meter.svelte";
	import ProgressLoading from "$lib/components/custom/progress-loading/ProgressLoading.svelte";
	import { Button, Card } from "$lib/components/ui";
	import Spinner from "$lib/components/ui/spinner/spinner.svelte";
	import { HouseIcon, EllipsisIcon, CircleIcon, CircleArrowDown, CircleArrowDownIcon } from "@lucide/svelte";
	import * as StarRating from "$lib/components/custom/star-rating";

	let starValue = $state(0);
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
		{#if isLoading}
			<Spinner class="size-6" />
		{/if}
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
	<Card.Content class="flex flex-col gap-2">
		<ProgressLoading value={20} />
		<ProgressLoading value={20} class="h-1" innerClass="bg-purple-500" />
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Meter</Card.Title>
	</Card.Header>
	<Card.Content class="flex flex-col gap-2">
		<Meter value={30} />
		<div class="flex w-100 flex-col">
			<div class="mb-1 flex w-full justify-between text-sm font-medium">
				<div>Total</div>
				<div>7 / 10</div>
			</div>
			<Meter value={7} max={10} />
		</div>
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
					icon: HouseIcon,
					action: () => console.log("test"),
				},
				{
					text: "Another",
					icon: EllipsisIcon,
					href: "/",
				},
			]}
			variant="outline"
		/>
		<Actions
			actions={[{ label: "test" }, {}, { text: "Test", icon: HouseIcon, action: () => console.log("test") }]}
			variant="outline"
		/>
		<Actions actions={[{ text: "Test", class: "bg-primary", action: () => console.log("test") }]} />
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

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>StarRating</Card.Title>
	</Card.Header>
	<Card.Content>
		<div>
			<StarRating.Root bind:value={starValue}>
				{#snippet children({ items })}
					{#each items as item (item.index)}
						<StarRating.Star {...item} />
					{/each}
				{/snippet}
			</StarRating.Root>
			<span class="text-muted-foreground text-sm">Rating is {starValue}</span>
		</div>
		<div>
			<StarRating.Root bind:value={starValue} allowHalf>
				{#snippet children({ items })}
					{#each items as item (item.index)}
						<StarRating.Star {...item} />
					{/each}
				{/snippet}
			</StarRating.Root>
			<span class="text-muted-foreground text-sm">Rating is {starValue}</span>
		</div>
		<div>
			<StarRating.Root bind:value={starValue} max={10}>
				{#snippet children({ items })}
					{#each items as item (item.index)}
						<StarRating.Star {...item} class="text-yellow-500" />
					{/each}
				{/snippet}
			</StarRating.Root>
		</div>
	</Card.Content>
</Card.Root>
