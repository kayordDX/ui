<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle, Button } from "$lib";
	import * as Form from "$lib/components/ui/form";

	import { z } from "zod";
	import type { SuperValidated } from "sveltekit-superforms";

	export let form: SuperValidated<FormSchema>;

	const formSchema = z.object({
		username: z.string().min(2).max(50),
	});

	type FormSchema = typeof formSchema;
</script>

<Card class="m-5">
	<CardHeader>
		<CardTitle>Forms</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="flex space-x-2">
			<Form.Root method="POST" {form} schema={formSchema} let:config>
				<Form.Field {config} name="username">
					<Form.Item>
						<Form.Label>Username</Form.Label>
						<Form.Input />
						<Form.Description>This is your public display name.</Form.Description>
						<Form.Validation />
					</Form.Item>
				</Form.Field>
				<Form.Button>Submit</Form.Button>
			</Form.Root>
		</div>
	</CardContent>
</Card>
