<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		AlertDialog,
		AlertDialogTrigger,
		AlertDescription,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogOverlay,
		AlertDialogPortal,
		AlertDialogTitle,
		Button,
	} from "$lib";
	import { AlertCircle } from "lucide-svelte";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Alert</CardTitle>
	</CardHeader>
	<CardContent>
		<AlertDialog>
			<AlertDialogTrigger asChild let:builder>
				<Button builders={[builder]} variant="outline">Show Dialog</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete your account and remove your
						data from our servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	</CardContent>
</Card>
