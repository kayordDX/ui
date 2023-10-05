<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Card } from "$lib/components/ui/card";
	import { Mail } from "lucide-svelte";
	import { ChevronRight } from "lucide-svelte";
	import { Loader } from "$lib/components/custom/loader";
</script>

<Loader />
<div class="m-5">
	<Card class="p-5">
		<div class="flex space-x-2">
			<Button>Button</Button>
			<Button>
				<Mail class="mr-2 h-4 w-4" />
				Login with Email
			</Button>
			<Button variant="outline" size="icon">
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	</Card>
</div>
