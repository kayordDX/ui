<script lang="ts">
	import { Calendar, Card } from "$lib";
	import { getLocalTimeZone, today } from "@internationalized/date";

	let value = $state(today(getLocalTimeZone()));
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Calendar</Card.Title>
	</Card.Header>
	<Card.Content class="w-fit">
		<Calendar type="single" bind:value class="rounded-md" />
	</Card.Content>
</Card.Root>
