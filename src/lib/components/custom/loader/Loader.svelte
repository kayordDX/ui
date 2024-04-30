<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { cn } from "$lib/utils";
	import { type Icon } from "lucide-svelte";
	import LoaderCircleIcon from "lucide-svelte/icons/loader-circle";
	import { fade } from "svelte/transition";

	interface LoaderIconProps extends Omit<ComponentProps<Icon>, "iconNode"> {
		isLoading?: boolean;
	}

	type $$Props = LoaderIconProps;
	let className: $$Props["class"] = undefined;
	export let isLoading: $$Props["isLoading"] = true;
	export { className as class };
</script>

{#if isLoading}
	<div class="flex justify-center" in:fade={{ delay: 150, duration: 400 }} out:fade={{ duration: 0 }}>
		<LoaderCircleIcon class={cn("h-8 w-8 animate-spin m-2", className)} {...$$restProps} />
	</div>
{/if}
