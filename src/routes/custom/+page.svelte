<script lang="ts">
	import { Loader, LightSwitch } from "$lib";
	import ProgressLoading from "$lib/components/custom/progress-loading/ProgressLoading.svelte";
	import { Button, Card } from "$lib/components/ui";

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
		<Card.Title>LightSwitch</Card.Title>
	</Card.Header>
	<Card.Content>
		<LightSwitch />
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
