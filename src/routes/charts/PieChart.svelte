<script lang="ts">
	import { PieChart } from "layerchart";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import { Card, Chart } from "$lib";

	const chartData = [
		{ browser: "chrome", visitors: 275 },
		{ browser: "safari", visitors: 200 },
		{ browser: "firefox", visitors: 187 },
		{ browser: "edge", visitors: 173 },
		{ browser: "other", visitors: 90 },
	];

	const chartConfig = {
		visitors: { label: "Visitors" },
		chrome: { label: "Chrome" },
		safari: { label: "Safari" },
		firefox: { label: "Firefox" },
		edge: { label: "Edge" },
		other: { label: "Other" },
	} satisfies Chart.ChartConfig;
</script>

<Card.Root class="flex flex-col">
	<Card.Header class="items-center">
		<Card.Title>Pie Chart</Card.Title>
		<Card.Description>January - June 2024</Card.Description>
	</Card.Header>
	<Card.Content class="flex-1">
		<Chart.Container config={chartConfig} class="mx-auto aspect-square max-h-[250px]">
			<PieChart
				data={chartData}
				key="browser"
				value="visitors"
				props={{
					pie: {
						motion: "tween",
					},
				}}
			>
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</PieChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer class="flex-col gap-2 text-sm">
		<div class="flex items-center gap-2 leading-none font-medium">
			Trending up by 5.2% this month <TrendingUpIcon class="size-4" />
		</div>
		<div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
	</Card.Footer>
</Card.Root>
