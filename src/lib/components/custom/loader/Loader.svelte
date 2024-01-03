<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { cn } from "$lib/utils";
	import { Loader2, type Icon } from "lucide-svelte";

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
		<Loader2 class={cn("h-8 w-8 animate-spin m-2", className)} {...$$restProps} />
	</div>
{/if}
