<script lang="ts">
	import { Avatar } from "$lib";
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	let { ref = $bindable(null), class: className, ...restProps }: AvatarPrimitive.RootProps = $props();
</script>

<Avatar.Root bind:ref class={cn("bg-accent ring-background ring-2", className)} {...restProps} />
