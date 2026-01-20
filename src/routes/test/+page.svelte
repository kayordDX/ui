<script lang="ts">
	import { Card } from "$lib";
	import { useSearchParams } from "runed/kit";
	import { z } from "zod";

	const productSearchSchema = z.object({
		page: z.coerce.number().default(1),
		filter: z.string().default(""),
		sort: z.enum(["newest", "oldest", "price"]).default("newest"),
	});

	const params = useSearchParams(productSearchSchema);
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Test</Card.Title>
	</Card.Header>
	<Card.Content>
		<input type="text" bind:value={params.filter} />
	</Card.Content>
</Card.Root>
