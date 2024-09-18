<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { cn } from "$lib/utils";
	import type { ComponentProps } from "svelte";

	interface Props extends Omit<ComponentProps<Checkbox>, "checked"> {
		checked?: boolean | "indeterminate";
		class?: string;
	}

	let { checked, class: className, ...rest }: Props = $props();
</script>

<Checkbox bind:checked class={cn(className)} {...rest} />
