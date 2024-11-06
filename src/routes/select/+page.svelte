<script lang="ts">
	import { Card, Select } from "$lib";
	import Button from "$lib/components/ui/button/button.svelte";

	const items = [
		{ value: "light", label: "Light" },
		{ value: "dark", label: "Dark" },
		{ value: "system", label: "System" },
	];

	let selectedValue = $state<string | undefined>(undefined);
	const triggerContent = $derived(items.find((f) => f.value === selectedValue)?.label ?? "Theme");
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Select</Card.Title>
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
		<Button onclick={() => alert("button clicked")}>test</Button>
	</Card.Content>
</Card.Root>
