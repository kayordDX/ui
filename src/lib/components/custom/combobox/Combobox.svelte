<script lang="ts">
	import { buttonVariants, Command, Popover } from "$lib";
	import { cn } from "$lib/utils";
	import { CheckIcon, ChevronsUpDown } from "lucide-svelte";
	import { tick } from "svelte";
	import Loader from "../loader/Loader.svelte";

	interface Props {
		value?: string | number;
		name: string;
		items: Array<{
			value: string | number;
			label: string;
		}>;
		open?: boolean;
		class?: string;
		isLoading?: boolean;
		shouldFilter?: boolean;
		search?: string;
	}

	let {
		value = $bindable(),
		name,
		open = $bindable(false),
		class: className,
		items,
		isLoading = false,
		shouldFilter = true,
		search = $bindable(""),
		...props
	}: Props = $props();

	const itemSelect = $derived.by(() => {
		const selectItem = items.find((f) => f.value === value);
		if (selectItem == null) return `Select ${name}...`;
		return selectItem.label;
	});

	let triggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root
	bind:open
	onOpenChange={() => {
		if (shouldFilter) search = "";
	}}
>
	<Popover.Trigger
		bind:ref={triggerRef}
		class={cn(
			buttonVariants({ variant: "outline" }),
			"w-full justify-between",
			!value && "text-muted-foreground",
			className
		)}
		role="combobox"
		{...props}
	>
		{#if isLoading}
			<Loader />
		{:else}
			{itemSelect}
		{/if}
		<ChevronsUpDown class="opacity-50" />
	</Popover.Trigger>

	<input hidden bind:value {name} />

	<Popover.Content class="w-(--bits-floating-anchor-width) p-0" align="start">
		<Command.Root {shouldFilter}>
			<Command.Input autofocus placeholder={`Search ${name}...`} class="h-9" bind:value={search} />
			<Command.List>
				<Command.Empty>No Results.</Command.Empty>
				<Command.Group>
					{#each items as item (item.value)}
						<Command.Item
							value={item.label}
							onSelect={() => {
								value = item.value;
								closeAndFocusTrigger();
							}}
						>
							{item.label}
							<CheckIcon class={cn("ml-auto", item.value !== value && "text-transparent")} />
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
