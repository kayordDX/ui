<script lang="ts">
	import "../app.css";
	import { LightSwitch } from "$lib";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import Menu from "./Menu.svelte";
	import type { Snippet } from "svelte";
	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex h-screen flex-col">
	<ModeWatcher />
	<Toaster />
	<div class="flex justify-between border-b-2 p-2">
		<img src="/logo.svg" alt="logo" class="h-10" />
		<LightSwitch />
	</div>

	<div class="flex flex-grow">
		<Menu />
		<div class="w-full">{@render children?.()}</div>
	</div>
</div>
