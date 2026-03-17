<script lang="ts">
	import { cn } from "$lib/utils";
	import { getStepperContext } from "./ctx";

	let { class: className }: { class?: string } = $props();
	const ctx = getStepperContext();
	let isVertical = $derived(ctx.orientation() === "vertical");
</script>

<div
	class={cn(
		"bg-muted flex-1",

		!isVertical && "-mt-8 mr-4 ml-4 h-[2px]",

		isVertical && "absolute top-14 -bottom-4 left-[27px] w-[2px]",

		className
	)}
>
	<div
		class={cn(
			"bg-primary transition-all duration-200 ease-in-out",
			!isVertical && "h-full w-full origin-left scale-x-0 group-data-[state=completed]:scale-x-100",
			isVertical && "h-full w-full origin-top scale-y-0 group-data-[state=completed]:scale-y-100"
		)}
	/>
</div>
