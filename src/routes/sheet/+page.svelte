<script lang="ts">
	import { Card, Button, Sheet } from "$lib";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Sheet</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-2">
			<Sheet.Root>
				<Sheet.Trigger>
					<Button>Open</Button>
				</Sheet.Trigger>
				<Sheet.Content>
					<Sheet.Header>
						<Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
						<Sheet.Description>
							This action cannot be undone. This will permanently delete your account and remove your data from our
							servers.
						</Sheet.Description>
					</Sheet.Header>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</Card.Content>
</Card.Root>
