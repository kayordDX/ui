<script lang="ts">
	import { Button } from "$lib";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { Mail } from "lucide-svelte";
	import { ChevronRight } from "lucide-svelte";
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Buttons</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex space-x-2">
			<Button>Default</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="link">Link</Button>
			<Button variant="secondary">Secondary</Button>
			<Button>
				<Mail class="mr-2 h-4 w-4" />
				Icon Text
			</Button>
			<Button variant="outline" size="icon">
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	</CardContent>
</Card>
