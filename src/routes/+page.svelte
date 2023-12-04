<script lang="ts">
	import { Accordion, Button, Card } from "$lib";
	import { Mail, type IconProps, type IconEvents } from "lucide-svelte";
	import { ChevronRight } from "lucide-svelte";
	import { ModeWatcher } from "mode-watcher";
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

What
<ModeWatcher />
After
