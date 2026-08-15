<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { Maximize, Minimize } from "@lucide/svelte";

	interface Props {
		isFullscreen: boolean;
		end?: HTMLElement;
	}

	let { isFullscreen = $bindable(), end }: Props = $props();

	let previous = isFullscreen;

	$effect(() => {
		if (isFullscreen === previous) return;
		previous = isFullscreen;

		if (isFullscreen) {
			document.body.classList.add("overflow-hidden");
			document.body.scrollIntoView({ behavior: "smooth", block: "start" });
		} else {
			document.body.classList.remove("overflow-hidden");
			end?.scrollIntoView({ behavior: "smooth", block: "start" });
		}

		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	});
</script>

<Button
	class="grow"
	variant="outline"
	size="sm"
	onclick={() => {
		isFullscreen = !isFullscreen;
	}}
>
	{#if isFullscreen}
		<Minimize class="size-5" />
	{:else}
		<Maximize class="size-5" />
	{/if}
</Button>
