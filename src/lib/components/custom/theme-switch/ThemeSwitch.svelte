<script lang="ts">
	import { toggleMode, mode } from "mode-watcher";
	import { Moon, Sun } from "lucide-svelte";
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
