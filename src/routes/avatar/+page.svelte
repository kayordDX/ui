<script lang="ts">
	import { Card, Avatar } from "$lib";
</script>

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
