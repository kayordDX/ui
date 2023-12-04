<script lang="ts">
	import { Card, Button } from "$lib";
	import { ChevronRight, Mail } from "lucide-svelte";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Button</Card.Title>
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
