<script lang="ts">
	import { Card } from "$lib";
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Sonner</Card.Title>
	</Card.Header>
	<Card.Content>
		<Button
			variant="outline"
			onclick={() =>
				toast.success("Event has been created", {
					description: "Sunday, December 03, 2023 at 9:00 AM",
				})}
		>
			Show Toast
		</Button>
	</Card.Content>
</Card.Root>
