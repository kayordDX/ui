<script lang="ts">
	import { Card, AlertDialog, Button, Drawer, toast } from "$lib";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Alert</Card.Title>
	</Card.Header>
	<Card.Content>
		<AlertDialog.Root>
			<AlertDialog.Trigger>
				<Button variant="outline">Show Dialog</Button>
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
					<AlertDialog.Description
						>This action cannot be undone. This will permanently delete your account and remove your data from our
						servers.</AlertDialog.Description
					>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action>Continue</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Drawer</Card.Title>
	</Card.Header>
	<Card.Content class="w-fit">
		<Drawer.Root>
			<Drawer.Trigger>
				<Button>Open</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Move Goal</Drawer.Title>
					<Drawer.Description>Set your daily activity goal.</Drawer.Description>
				</Drawer.Header>
			</Drawer.Content>
		</Drawer.Root>
	</Card.Content>
</Card.Root>

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
