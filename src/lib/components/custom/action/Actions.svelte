<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import EllipsisVerticalIcon from "@lucide/svelte/icons/ellipsis-vertical";
	import { isActionGroup, isActionType, type ActionsType } from "./types";
	import Action from "./Action.svelte";
	import { cn } from "$lib/utils";

	let { actions, text, class: className, icon, variant = "ghost" }: ActionsType = $props();

	const ActionIcon = $derived(icon);

	const size = $derived(text ? "default" : "icon");
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={cn(buttonVariants({ variant, size }), className)}>
		{#if ActionIcon}
			<ActionIcon />
		{:else}
			<EllipsisVerticalIcon class="h-4 w-4" />
		{/if}
		{text}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		{#each actions as action}
			{#if isActionType(action)}
				<Action {...action} />
			{:else if isActionGroup(action)}
				{#if action.child}
					{@render action.child?.()}
				{:else}
					<DropdownMenu.Group>
						<DropdownMenu.Label>{action.label}</DropdownMenu.Label>
					</DropdownMenu.Group>
				{/if}
			{:else}
				<DropdownMenu.Separator />
			{/if}
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
