<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { Maximize, Minimize } from "@lucide/svelte";

	interface Props {
		isFullscreen: boolean;
		end?: HTMLElement;
	}

	let { isFullscreen = $bindable(), end }: Props = $props();

	$effect.pre(() => {
		if (isFullscreen) {
			document.body.classList.add("overflow-hidden");
			document.body.scrollIntoView({ behavior: "smooth", block: "start" });
		} else {
			if (!end) {
				document.body.classList.remove("overflow-hidden");
				return;
			}
			end.scrollIntoView({ behavior: "smooth", block: "start" });
			document.body.classList.remove("overflow-hidden");
		}
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
