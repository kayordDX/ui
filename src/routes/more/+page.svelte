<script lang="ts">
	import { Card, Chip, ColorPicker, DateStrip, DynamicSelect, Timeline } from "$lib";
	import AudioWave from "$lib/components/ui/audio-wave/audio-wave.svelte";

	const frameworks = [
		{ label: "react", value: "React" },
		{ label: "svelte", value: "Svelte" },
		{ label: "vue", value: "Vue" },
	];
	let framework = $state(frameworks[0].value);
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
		<div>
			<div class="text-muted-foreground mb-2 text-xs">Timeline</div>
			<Timeline.Root>
				<Timeline.Item>
					<Timeline.Separator />
					<Timeline.Content>
						<Timeline.Date>Aug 2024</Timeline.Date>
						<Timeline.Title>First Event</Timeline.Title>
						<Timeline.Description>Details...</Timeline.Description>
					</Timeline.Content>
				</Timeline.Item>
				<Timeline.Item>
					<Timeline.Separator />
					<Timeline.Content>
						<Timeline.Date>Aug 2024</Timeline.Date>
						<Timeline.Title>Latest</Timeline.Title>
						<Timeline.Description>Details...</Timeline.Description>
					</Timeline.Content>
				</Timeline.Item>
			</Timeline.Root>
		</div>
		<div>
			<div class="text-muted-foreground mb-2 text-xs">Dynamic Select</div>
			<DynamicSelect.Root bind:value={framework}>
				<DynamicSelect.Trigger>Select framework...</DynamicSelect.Trigger>
				<DynamicSelect.Content>
					<DynamicSelect.Group>
						{#each frameworks as f}
							<DynamicSelect.Item value={f.label}>{f.value}</DynamicSelect.Item>
						{/each}
					</DynamicSelect.Group>
				</DynamicSelect.Content>
			</DynamicSelect.Root>
		</div>
		<div>
			<div class="text-muted-foreground mb-2 text-xs">Dynamic Select</div>
			<AudioWave />
			<AudioWave bars={3} class="h-4" barColor="bg-green-500" />
		</div>
	</Card.Content>
</Card.Root>
