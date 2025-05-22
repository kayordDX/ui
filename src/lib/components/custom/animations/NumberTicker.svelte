<script lang="ts">
	import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";
	import { Tween } from "svelte/motion";
	import { cn } from "$lib/utils";

	interface Props {
		value: number;
		initial?: number;
		duration?: number;
		class?: string;
	}

	let { value, initial = 0, duration = 2000, class: className, ...restProps }: Props = $props();

	let num = new Tween(initial, {
		duration: duration,
		easing: cubicOut,
	});

	onMount(() => {
		num.set(value);
	});
</script>

<div class={cn("inline-block  tracking-normal text-black dark:text-white", className)} {...restProps}>
	{num.current.toFixed(0)}
</div>
