<script lang="ts">
	import { toggleMode, mode } from "mode-watcher";
	import { Moon, Sun } from "lucide-svelte";
</script>

<button on:click={toggleMode} class="text-primary">
	{#if $mode == "dark"}
		<Moon />
	{:else}
		<Sun />
	{/if}
</button>
