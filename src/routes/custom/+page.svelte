<script lang="ts">
	import { Loader, ThemeSwitch } from "$lib";
	import { Card } from "$lib/components/ui/card";
	import CardContent from "$lib/components/ui/card/card-content.svelte";
	import CardDescription from "$lib/components/ui/card/card-description.svelte";
	import CardHeader from "$lib/components/ui/card/card-header.svelte";
	import CardTitle from "$lib/components/ui/card/card-title.svelte";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Loader</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="w-10">
			<Loader />
		</div>
	</CardContent>
</Card>

<Card class="m-5">
	<CardHeader>
		<CardTitle>ThemeSwitch</CardTitle>
	</CardHeader>
	<CardContent>
		<ThemeSwitch />
		<ThemeSwitch class="text-orange-400" />
	</CardContent>
</Card>
