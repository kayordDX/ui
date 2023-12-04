<script lang="ts">
	import { Card, Badge } from "$lib";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Badge</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-4">
			<Badge>Default</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="secondary">Secondary</Badge>
		</div>
	</Card.Content>
</Card.Root>
