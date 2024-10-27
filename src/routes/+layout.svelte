<script lang="ts">
	import "../app.postcss";
	import { ThemeSwitch } from "$lib";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import Menu from "./Menu.svelte";
	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();
</script>

<ModeWatcher />
<Toaster />
<div class="flex justify-between border-b-2 p-2">
	<img src="/logo.svg" alt="logo" class="h-10" />
	<ThemeSwitch />
</div>

<div class="flex">
	<Menu />
	<div class="w-full">{@render children?.()}</div>
</div>
