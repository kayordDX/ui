<script lang="ts">
	import Combobox from "$lib/components/custom/combobox/Combobox.svelte";
	import { Card } from "$lib/components/ui";

	let isLoading = $state(true);
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Combobox</Card.Title>
	</Card.Header>
	<Card.Content>
		<Combobox
			name="test"
			items={[
				{ value: "1", label: "test" },
				{
					value: "2",
					label: "what",
				},
			]}
		/>
	</Card.Content>
</Card.Root>
