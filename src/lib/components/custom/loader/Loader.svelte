<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { cn } from "$lib/utils";
	import { type Icon } from "lucide-svelte";
	import LoaderCircleIcon from "lucide-svelte/icons/loader-circle";
	import { scale } from "svelte/transition";

	interface LoaderIconProps extends Omit<ComponentProps<Icon>, "iconNode"> {
		isLoading?: boolean;
	}

	export { className as class };

	interface Props {
		class?: string | undefined | null;
		isLoading?: boolean;
		iconProps?: LoaderIconProps;
	}

	let { class: className = undefined, isLoading = true, iconProps }: Props = $props();
</script>

{#if isLoading}
	<div class="flex justify-center" in:scale={{ duration: 350 }} out:scale={{ duration: 200 }}>
		<LoaderCircleIcon class={cn("m-2 h-8 w-8 animate-spin", className)} {...iconProps} />
	</div>
{/if}
