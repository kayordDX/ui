<script lang="ts">
	import { Button, Card, Drawer } from "$lib";
</script>

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
