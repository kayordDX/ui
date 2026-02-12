<script lang="ts">
	import { Card, Chip, ColorPicker } from "$lib";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>More</Card.Title>
		<Card.Description>https://more-shadcn.noair.fun/</Card.Description>
	</Card.Header>
	<Card.Content>
		<div>
			<div class="text-muted-foreground mb-2 text-xs">Chip</div>
			<Chip.Root>Test</Chip.Root>
			<Chip.Root removable>React</Chip.Root>
		</div>
		<div>
			<div class="text-muted-foreground mb-2 text-xs">Color Picker</div>
			<ColorPicker />
		</div>
	</Card.Content>
</Card.Root>
