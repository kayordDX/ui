<script lang="ts">
	import { Card } from "$lib";
	import { NumberTicker } from "$lib";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Test</Card.Title>
	</Card.Header>
	<Card.Content>
		<NumberTicker value={1000} duration={800} class="text-4xl font-bold" />
	</Card.Content>
</Card.Root>
