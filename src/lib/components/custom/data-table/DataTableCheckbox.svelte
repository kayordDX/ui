<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { cn } from "$lib/utils";
	import type { ComponentProps } from "svelte";

	interface Props extends ComponentProps<typeof Checkbox> {
		checked?: boolean | "indeterminate";
		class?: string;
	}

	let { checked, class: className, ...rest }: Props = $props();
</script>

<Checkbox bind:checked class={cn(className)} {...rest} />
