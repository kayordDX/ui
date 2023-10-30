<script lang="ts">
	import { Accordion, AccordionItem, AccordionContent, AccordionTrigger, Button, Card, CardContent, CardHeader, CardTitle } from "$lib";
	import { Mail, type IconProps, type IconEvents } from "lucide-svelte";
	import { ChevronRight } from "lucide-svelte";
	import { ModeWatcher } from "mode-watcher";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Buttons</CardTitle>
	</CardHeader>
	<CardContent>
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
	</CardContent>
</Card>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Accordion</CardTitle>
	</CardHeader>
	<CardContent>
		<Accordion>
			<AccordionItem value="item-1">
				<AccordionTrigger>Item 1</AccordionTrigger>
				<AccordionContent>Item Content</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Item 2</AccordionTrigger>
				<AccordionContent>Item Content yeah</AccordionContent>
			</AccordionItem>
		</Accordion>
	</CardContent>
</Card>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Alert</CardTitle>
	</CardHeader>
	<CardContent>
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
	</CardContent>
</Card>

What
<ModeWatcher />
After
