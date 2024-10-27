<script lang="ts">
	import { Accordion, Button, Card, Table } from "$lib";
	import Mail from "lucide-svelte/icons/mail";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Buttons</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-2">
			<Button variant="default">Default</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="link">Link</Button>
			<Button variant="secondary">Secondary</Button>
			<Button>
				<Mail class="mr-2 h-4 w-4" />
				Icon Text
			</Button>
			<Button variant="outline" size="icon">
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	</Card.Content>
</Card.Root>

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
		<Card.Title>Alert</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-2">
			<Button>Default</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="link">Link</Button>
			<Button variant="secondary">Secondary</Button>
			<Button>
				<Mail class="mr-2 h-4 w-4" />
				Icon Text
			</Button>
			<Button variant="outline" size="icon">
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Table</Card.Title>
	</Card.Header>
	<Card.Content>
		<Table.Root class="mb-2">
			<Table.Body>
				<Table.Row>
					<Table.Cell>User Total</Table.Cell>
					<Table.Cell class="float-right">Test</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>User Payment Total</Table.Cell>
					<Table.Cell class="float-right">Test</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>User Balance</Table.Cell>
					<Table.Cell class="float-right">Test</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>User Tips</Table.Cell>
					<Table.Cell class="float-right">Test</Table.Cell>
				</Table.Row>
			</Table.Body>
		</Table.Root>
	</Card.Content>
</Card.Root>
