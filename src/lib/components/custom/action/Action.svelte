<script lang="ts">
	import { goto } from "$app/navigation";
	import { DropdownMenu } from "#lib";
	import { cn } from "#lib/utils.js";
	import type { ActionType } from "./types";

	let { text, icon, action, href, class: className }: ActionType = $props();

	const ActionIcon = $derived(icon);

	const clickAction = $derived(
		href
			? async () => {
					const url = new URL(href, window.location.href);
					if (url.origin !== window.location.origin) {
						window.location.href = url.href;
						return;
					}
					try {
						await goto(url);
					} catch {
						window.location.href = url.href;
					}
				}
			: action
	);
</script>

<DropdownMenu.Item onclick={clickAction} class={cn(className)}>
	{#if ActionIcon}
		<ActionIcon />
	{/if}
	{text}
</DropdownMenu.Item>
