<script lang="ts">
	import { Accordion, Card } from "$lib";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Accordion</Card.Title>
	</Card.Header>
	<Card.Content>
		<Accordion.Root>
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Item 1</Accordion.Trigger>
				<Accordion.Content>Item Content</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-2">
				<Accordion.Trigger>Item 2</Accordion.Trigger>
				<Accordion.Content>Item Content yeah</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Card.Content>
</Card.Root>
