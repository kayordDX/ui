<script lang="ts">
	import { Card, Form } from "$lib";
	// import * as Form from "$lib/components/ui/form";

	import { z } from "zod";
	import type { SuperValidated } from "sveltekit-superforms";

	export let form: SuperValidated<FormSchema>;

	const formSchema = z.object({
		username: z.string().min(2).max(50),
	});

	type FormSchema = typeof formSchema;
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Forms</Card.Title>
	</Card.Header>
	<Card.Content>
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
	</Card.Content>
</Card.Root>
