<script lang="ts">
	import {
		Accordion,
		AccordionItem,
		AccordionContent,
		AccordionTrigger,
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Accordion</CardTitle>
	</CardHeader>
	<CardContent>
		<Accordion>
			<AccordionItem value="item-1">
				<AccordionTrigger>Item 1</AccordionTrigger>
				<AccordionContent>Item Content</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Item 2</AccordionTrigger>
				<AccordionContent>Item Content yeah</AccordionContent>
			</AccordionItem>
		</Accordion>
	</CardContent>
</Card>
