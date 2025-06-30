<script lang="ts">
	import { type ProgressRootProps, Progress } from "bits-ui";
	import { cn } from "$lib/utils";

	interface Props {
		class?: ProgressRootProps["class"];
		innerClass?: ProgressRootProps["class"];
		[key: string]: any;
	}

	let { class: className = undefined, innerClass = undefined, ...rest }: Props = $props();
</script>

<Progress.Root class={cn("bg-secondary relative h-4 w-full overflow-hidden rounded-full", className)} {...rest}>
	<div class={cn("progressbar-infinite bg-primary h-full w-full flex-1 transition-all", innerClass)}></div>
</Progress.Root>

<style>
	.progressbar-infinite {
		animation:
			md-progressbar-infinite-1 2s linear infinite,
			md-progressbar-infinite-2 2s linear infinite;
	}

	@keyframes md-progressbar-infinite-1 {
		0% {
			transform: translateX(-10%) scaleX(0.1);
		}
		25% {
			transform: translateX(30%) scaleX(0.6);
		}
		50% {
			transform: translateX(100%) scaleX(1);
		}
		100% {
			transform: translateX(100%) scaleX(1);
		}
	}
	@keyframes md-progressbar-infinite-2 {
		0% {
			transform: translateX(-100%) scaleX(1);
		}
		40% {
			transform: translateX(-100%) scaleX(1);
		}
		75% {
			transform: translateX(60%) scaleX(0.35);
		}
		90% {
			transform: translateX(100%) scaleX(0.1);
		}
		100% {
			transform: translateX(100%) scaleX(0.1);
		}
	}
</style>
