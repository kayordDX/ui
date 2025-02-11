<script lang="ts">
	import { Button, Card } from "$lib";
	let a = $state(["1"]);

	$inspect(a);
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Welcome</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-2">
			<Button onclick={() => a.push(a.length.toString())}>+</Button>
		</div>
		{a}
	</Card.Content>
</Card.Root>
