<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { cn } from "$lib/utils";
	import { type Icon } from "lucide-svelte";
	import LoaderCircleIcon from "lucide-svelte/icons/loader-circle";

	interface LoaderIconProps extends ComponentProps<Icon> {
		isLoading?: boolean;
	}

	type $$Props = LoaderIconProps;
	let className: $$Props["class"] = undefined;
	export let isLoading: $$Props["isLoading"] = true;
	export { className as class };
</script>

{#if isLoading}
	<div class="flex justify-center">
		<LoaderCircleIcon class={cn("h-8 w-8 animate-spin m-2", className)} {...$$restProps} />
	</div>
{/if}
