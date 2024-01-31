<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { cn } from "$lib/utils";
	import type { ComponentProps } from "svelte";
	import type { Writable } from "svelte/store";

	interface DataTableCheckboxProps extends Omit<ComponentProps<Checkbox>, "checked"> {
		checked: Writable<boolean>;
	}

	type $$Props = DataTableCheckboxProps;
	let className: $$Props["class"] = undefined;
	export { className as class };
	export let checked: $$Props["checked"];
</script>

<Checkbox bind:checked={$checked} class={cn(className)} />
