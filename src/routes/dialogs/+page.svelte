<script lang="ts">
	import { Card, AlertDialog, Button, toast, DropdownMenu, buttonVariants } from "$lib";
	import { Drawer } from "$lib/drawer";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Alert</Card.Title>
	</Card.Header>
	<Card.Content>
		<AlertDialog.Root>
			<AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>Show Dialog</AlertDialog.Trigger>
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
			<Drawer.Trigger class={buttonVariants({ variant: "default" })}>Open</Drawer.Trigger>
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

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>DropDown</Card.Title>
	</Card.Header>
	<Card.Content>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger class={buttonVariants({ variant: "default" })}>Open</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Profile</DropdownMenu.Item>
					<DropdownMenu.Item>Billing</DropdownMenu.Item>
					<DropdownMenu.Item>Team</DropdownMenu.Item>
					<DropdownMenu.Item>Subscription</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Card.Content>
</Card.Root>
