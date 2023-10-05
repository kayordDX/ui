<script lang="ts">
	import "../app.postcss";
	import { ThemeSwitch } from "$lib";
	import Menu from "./Menu.svelte";
</script>

<div class="border-b-2 p-2 flex justify-between">
	<div>Kayord UI (Logo)</div>
	<ThemeSwitch />
</div>

<div class="flex">
	<Menu />
	<div class="w-full"><slot /></div>
</div>
