<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { Maximize, Minimize } from "lucide-svelte";
	import { tableStore } from "./table.svelte";
</script>

<Button
	class="grow"
	variant="outline"
	size="sm"
	onclick={() => {
		tableStore.isFullscreen = !tableStore.isFullscreen;
		// if ($target == "body") {
		// 	$target = "#tableContent";
		// } else {
		// 	$target = "body";
		// }
	}}
>
	{#if tableStore.isFullscreen}
		<Minimize class="size-5" />
	{:else}
		<Maximize class="size-5" />
	{/if}
</Button>
