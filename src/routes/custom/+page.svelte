<script lang="ts">
	import { Loader, ThemeSwitch } from "$lib";
	import ProgressLoading from "$lib/components/custom/progress-loading/ProgressLoading.svelte";
	import { Button, Card } from "$lib/components/ui";

	let isLoading = true;
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Loader</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="w-10">
			<Loader {isLoading} />
		</div>
		<Button on:click={() => (isLoading = !isLoading)}>Toggle Loading</Button>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>ThemeSwitch</Card.Title>
	</Card.Header>
	<Card.Content>
		<ThemeSwitch />
		<ThemeSwitch class="text-orange-400" />
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
