<script lang="ts">
	import { toggleMode, mode } from "mode-watcher";
	import Moon from "@lucide/svelte/icons/moon";
	import Sun from "@lucide/svelte/icons/sun";
	import { cn } from "$lib/utils";

	interface Props {
		class?: string | undefined | null;
	}

	let { class: className = undefined }: Props = $props();
</script>

<button onclick={toggleMode} class={cn("text-primary", className)}>
	{#if $mode == "dark"}
		<Moon />
	{:else}
		<Sun />
	{/if}
</button>
