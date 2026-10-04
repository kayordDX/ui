<script lang="ts">
	import { Checkbox } from "#lib/components/ui/checkbox/index.js";
	import { cn } from "#lib/utils.js";
	import type { ComponentProps } from "svelte";

	interface Props extends ComponentProps<typeof Checkbox> {
		checked?: boolean;
		indeterminate?: boolean;
		class?: string;
	}

	let { checked, class: className, ...rest }: Props = $props();
</script>

<Checkbox bind:checked class={cn("rounded-[5px]", className)} {...rest} />
