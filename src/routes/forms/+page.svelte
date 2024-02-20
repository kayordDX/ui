<script lang="ts">
	import { Card, Form, Input } from "$lib";

	import { z } from "zod";
	import { type SuperValidated, superForm, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	const formSchema = z.object({
		username: z.string().min(2).max(50),
	});

	export let data: SuperValidated<Infer<FormSchema>>;
	const form = superForm(data, {
		validators: zodClient(formSchema),
	});

	type FormSchema = typeof formSchema;

	const { form: formData, enhance } = form;
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Forms</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-2">
			<form method="POST" use:enhance>
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>Username</Form.Label>
						<Input {...attrs} bind:value={$formData.username} />
						<Form.Description>This is your public display name.</Form.Description>
						<Form.FieldErrors />
					</Form.Control>
				</Form.Field>
				<Form.Button>Submit</Form.Button>
			</form>
		</div>
	</Card.Content>
</Card.Root>
