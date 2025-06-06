<script lang="ts">
	import { Card, Alert, Avatar, Badge } from "$lib";
	import AlertCircle from "@lucide/svelte/icons/circle-alert";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Alert</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="space-y-2">
			<Alert.Root>
				<Alert.Title>Title</Alert.Title>
				<Alert.Description>Description</Alert.Description>
			</Alert.Root>

			<Alert.Root variant="destructive">
				<Alert.Title><div class="flex"><AlertCircle class="mr-2 h-4 w-4" />Error</div></Alert.Title>
				<Alert.Description>Destructive</Alert.Description>
			</Alert.Root>
		</div>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Avatar</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-4">
			<Avatar.Root>
				<Avatar.Image src="https://github.com/jacokok.png" alt="@jacokok" />
				<Avatar.Fallback>KJ</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback>KJ</Avatar.Fallback>
			</Avatar.Root>
			<Avatar.Root>
				<Avatar.Fallback class="bg-green-500">KJ</Avatar.Fallback>
			</Avatar.Root>
		</div>
	</Card.Content>
</Card.Root>

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
