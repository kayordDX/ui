<script lang="ts">
	import { scaleBand } from "d3-scale";
	import { Bar, BarChart, Highlight, type ChartContextValue } from "layerchart";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import { cubicInOut } from "svelte/easing";
	import { Card, Chart } from "$lib";

	const chartData = [
		{ month: "January", desktop: 186, color: "var(--chart-1)" },
		{ month: "February", desktop: 305, color: "var(--chart-1)" },
		{ month: "March", desktop: 237, color: "var(--chart-1)" },
		{ month: "April", desktop: 73, color: "var(--chart-1)" },
		{ month: "May", desktop: 209, color: "var(--chart-1)" },
		{ month: "June", desktop: 214, color: "var(--chart-1)" },
	];

	const chartConfig = {
		desktop: { label: "Desktop", color: "var(--chart-1)" },
	} satisfies Chart.ChartConfig;

	let context = $state<ChartContextValue>();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Bar Chart</Card.Title>
		<Card.Description>January - June 2024</Card.Description>
	</Card.Header>
	<Card.Content>
		<Chart.Container config={chartConfig} class="mx-auto max-h-[250px]">
			<BarChart
				bind:context
				data={chartData}
				xScale={scaleBand().padding(0.25)}
				x="month"
				axis="x"
				series={[{ key: "desktop", label: "Desktop", color: chartConfig.desktop.color }]}
				props={{
					bars: {
						stroke: "none",
						rounded: "all",
						radius: 12,
						// use the height of the chart to animate the bars
						initialY: context?.height,
						initialHeight: 0,
						motion: {
							x: { type: "tween", duration: 500, easing: cubicInOut },
							width: { type: "tween", duration: 500, easing: cubicInOut },
							height: { type: "tween", duration: 500, easing: cubicInOut },
							y: { type: "tween", duration: 500, easing: cubicInOut },
						},
					},
					xAxis: { format: (d) => d.slice(0, 3) },
				}}
			>
				{#snippet belowMarks()}
					<Highlight area={{ class: "fill-muted" }} />
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip hideLabel />
				{/snippet}
			</BarChart>
		</Chart.Container>
	</Card.Content>
	<Card.Footer>
		<div class="flex w-full items-start gap-2 text-sm">
			<div class="grid gap-2">
				<div class="flex items-center gap-2 leading-none font-medium">
					Trending up by 5.2% this month <TrendingUpIcon class="size-4" />
				</div>
				<div class="text-muted-foreground flex items-center gap-2 leading-none">
					Showing total visitors for the last 6 months
				</div>
			</div>
		</div>
	</Card.Footer>
</Card.Root>
