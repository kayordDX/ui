<script lang="ts">
	import { Card, Button, CopyButton } from "$lib";
	import Mail from "@lucide/svelte/icons/mail";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
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
			<CopyButton text="text to copy to clipboard" />
		</div>
	</Card.Content>
</Card.Root>
