<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		Avatar,
		AvatarFallback,
		AvatarImage,
	} from "$lib";
	import { AlertCircle } from "lucide-svelte";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Avatar</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex space-x-4">
			<Avatar>
				<AvatarImage src="https://github.com/jacokok.png" alt="@jacokok" />
				<AvatarFallback>KJ</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>KJ</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback class="bg-green-500">KJ</AvatarFallback>
			</Avatar>
		</div>
	</CardContent>
</Card>
