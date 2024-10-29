<script lang="ts">
	import { Card, Drawer, Select } from "$lib";
	import { Root } from "$lib/components/ui/accordion";
	import { Button, buttonVariants } from "$lib/components/ui/button";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Test</Card.Title>
	</Card.Header>
	<Card.Content>
		<Drawer.Root>
			<Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Open Drawer</Drawer.Trigger>
			<Drawer.Content>
				<div class="mx-auto w-full max-w-sm">
					<Drawer.Header>
						<Drawer.Title>Move Goal</Drawer.Title>
						<Drawer.Description>Set your daily activity goal.</Drawer.Description>
					</Drawer.Header>
					<div class="p-4 pb-0">
						<Select.Root type="single">
							<Select.Trigger class="w-[180px]">Theme</Select.Trigger>
							<Select.Content>
								<Select.Item value="light">Light</Select.Item>
								<Select.Item value="dark">Dark</Select.Item>
								<Select.Item value="system">System</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	</Card.Content>
</Card.Root>
