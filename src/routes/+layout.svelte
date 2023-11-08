<script lang="ts">
	import "../app.postcss";
	import { ThemeSwitch } from "$lib";
	import { ModeWatcher } from "mode-watcher";
	import Menu from "./Menu.svelte";
</script>

<ModeWatcher />
<div class="border-b-2 p-2 flex justify-between">
	<img src="/logo.svg" alt="logo" class="h-10" />
	<ThemeSwitch />
</div>

<div class="flex">
	<Menu />
	<div class="w-full"><slot /></div>
</div>
