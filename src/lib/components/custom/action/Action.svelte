<script lang="ts">
	import { goto } from "$app/navigation";
	import { DropdownMenu } from "$lib";
	import { cn } from "$lib/utils";
	import type { ActionType } from "./types";

	let { text, icon, action, href, class: className }: ActionType = $props();

	const ActionIcon = icon;

	const clickAction = href ? () => goto(href) : action;
</script>

<DropdownMenu.Item onclick={clickAction} class={cn(className)}><ActionIcon /> {text}</DropdownMenu.Item>
