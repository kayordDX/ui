<script lang="ts">
	import { Accordion, Calendar, Card } from "$lib";
	import { getLocalTimeZone, today } from "@internationalized/date";

	let value = $state(today(getLocalTimeZone()));
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Accordion</Card.Title>
	</Card.Header>
	<Card.Content>
		<Accordion.Root type="single">
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

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Calendar</Card.Title>
	</Card.Header>
	<Card.Content class="w-fit">
		<Calendar type="single" bind:value class="rounded-md" />
	</Card.Content>
</Card.Root>
