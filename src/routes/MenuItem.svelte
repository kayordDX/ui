<script lang="ts">
	import { Button } from "$lib";
	import { page } from "$app/stores";
	export let path: string;
	export let text: string;
	let isActive = $page.url.pathname == path;

	console.log($page.url.pathname, path);
</script>

<div class="space-y-1">
	<a href={path} data-sveltekit-reload>
		<Button variant={isActive ? "secondary" : "ghost"} class="w-full justify-start">
			{text}
		</Button>
	</a>
</div>
