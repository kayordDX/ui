<script lang="ts">
	import { Card, Chip, ColorPicker, DateStrip } from "$lib";
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>More</Card.Title>
		<Card.Description>https://more-shadcn.noair.fun/</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
		<div>
			<div class="text-muted-foreground mb-2 text-xs">Chip</div>
			<Chip.Root>Test</Chip.Root>
			<Chip.Root removable>React</Chip.Root>
		</div>
		<div>
			<div class="text-muted-foreground mb-2 text-xs">Color Picker</div>
			<ColorPicker />
		</div>
		<div class="flex flex-col">
			<div class="text-muted-foreground mb-2 text-xs">DateStrip</div>
			<DateStrip.Root class="w-fit">
				{#snippet children({ date })}
					<DateStrip.Item {date} />
				{/snippet}
			</DateStrip.Root>
		</div>
	</Card.Content>
</Card.Root>
