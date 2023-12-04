<script lang="ts">
	import { Loader, ThemeSwitch } from "$lib";
	import { Card } from "$lib/components/ui";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Loader</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="w-10">
			<Loader />
		</div>
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
