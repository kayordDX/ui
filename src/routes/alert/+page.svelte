<script lang="ts">
	import { Card, Alert } from "$lib";
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
