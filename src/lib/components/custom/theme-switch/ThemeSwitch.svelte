<script lang="ts">
	import { toggleMode, mode } from "mode-watcher";
	import Moon from "lucide-svelte/icons/moon";
	import Sun from "lucide-svelte/icons/sun";
	import { cn } from "$lib/utils";

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<button on:click={toggleMode} class={cn("text-primary", className)}>
	{#if $mode == "dark"}
		<Moon />
	{:else}
		<Sun />
	{/if}
</button>
