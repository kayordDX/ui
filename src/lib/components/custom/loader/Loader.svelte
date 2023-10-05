<script lang="ts">
	import { cn } from '$lib/utils';
	import { Loader2, type IconProps, type IconEvents } from 'lucide-svelte';
	import type { SvelteComponent } from 'svelte';

	type $$Props = SvelteComponent<IconProps, IconEvents, {}>;

	let className: $$Props['class'] = undefined;
</script>

<Loader2 class={cn('mr-2 h-4 w-4 animate-spin', className)} {...$$restProps} />
