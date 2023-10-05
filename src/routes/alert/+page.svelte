<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		Alert,
		AlertDescription,
		AlertTitle,
	} from "$lib";
	import { AlertCircle } from "lucide-svelte";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Alert</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="space-y-2">
			<Alert>
				<AlertTitle>Title</AlertTitle>
				<AlertDescription>Description</AlertDescription>
			</Alert>

			<Alert variant="destructive">
				<AlertTitle><div class="flex"><AlertCircle class="h-4 w-4 mr-2" />Error</div></AlertTitle>
				<AlertDescription>Destructive</AlertDescription>
			</Alert>
		</div>
	</CardContent>
</Card>
