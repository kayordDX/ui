<script lang="ts">
	import { Button } from "$lib";
	import { page } from "$app/stores";
	interface Props {
		path: string;
		text: string;
	}

	let { path, text }: Props = $props();
	let isActive = $page.url.pathname == path;
</script>

<div class="space-y-1">
	<a href={path} data-sveltekit-reload>
		<Button variant={isActive ? "secondary" : "ghost"} class="w-full justify-start">
			{text}
		</Button>
	</a>
</div>
