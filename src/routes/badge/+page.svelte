<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle, Badge } from "$lib";
	import { AlertCircle } from "lucide-svelte";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Badge</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex space-x-4">
			<Badge>Default</Badge>
			<Badge variant="destructive">Destructive</Badge>
			<Badge variant="outline">Outline</Badge>
			<Badge variant="secondary">Secondary</Badge>
		</div>
	</CardContent>
</Card>
