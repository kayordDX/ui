<script lang="ts">
	import { Card, Calendar } from "$lib";

	import { getLocalTimeZone, today } from "@internationalized/date";
	// import { Calendar } from "$lib/components/ui/calendar/index.js";

	let value = $state(today(getLocalTimeZone()));
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Calendar</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-4">
			<Calendar bind:value class="rounded-md border" />
		</div>
	</Card.Content>
</Card.Root>
