<script lang="ts">
	import { Card, Select } from "$lib";

	const items = [
		{ value: "light", label: "Light" },
		{ value: "dark", label: "Dark" },
		{ value: "system", label: "System" },
	];

	const triggerContent = $derived(items.find((f) => f.value === selectedValue)?.label ?? "Theme");
	let selectedValue = $state<string | undefined>(undefined);
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Test</Card.Title>
	</Card.Header>
	<Card.Content>
		<Select.Root type="single" bind:value={selectedValue} {items}>
			<Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
			<Select.Content>
				{#each items as item}
					<Select.Item value={item.value}>{item.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</Card.Content>
</Card.Root>
