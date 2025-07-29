<script lang="ts">
	import {
		Card,
		Checkbox,
		Combobox,
		Form,
		Input,
		InputOTP,
		Label,
		RadioGroup,
		Select,
		Slider,
		Switch,
		Textarea,
		Toggle,
		ToggleGroup,
	} from "$lib";

	import { z } from "zod";
	import { type SuperValidated, superForm, type Infer } from "sveltekit-superforms";
	import { zod4Client } from "sveltekit-superforms/adapters";

	const formSchema = z.object({
		username: z.string().min(2).max(50),
	});

	// type FormSchema = typeof formSchema;

	type FormSchema = z.infer<typeof formSchema>;

	interface Props {
		data: SuperValidated<FormSchema>;
	}

	let { data }: Props = $props();

	const form = superForm(data, {
		validators: zod4Client(formSchema),
	});

	const { form: formData, enhance } = form;

	const items = [
		{ value: "light", label: "Light" },
		{ value: "dark", label: "Dark" },
		{ value: "system", label: "System" },
	];

	let selectedValue = $state<string | undefined>(undefined);
	const triggerContent = $derived(items.find((f) => f.value === selectedValue)?.label ?? "Theme");
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Forms</Card.Title>
	</Card.Header>
	<Card.Content>
		<div class="flex space-x-2">
			<form method="POST" use:enhance>
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input {...props} bind:value={$formData.username} />
							<Form.Description>This is your public display name.</Form.Description>
							<Form.FieldErrors />
						{/snippet}
					</Form.Control>
				</Form.Field>
				<Textarea placeholder="Type your message here." />
				<Form.Button>Submit</Form.Button>
			</form>
		</div>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Input OTP</Card.Title>
	</Card.Header>
	<Card.Content>
		<InputOTP.Root maxlength={6}>
			{#snippet children({ cells })}
				<InputOTP.Group>
					{#each cells.slice(0, 3) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
				<InputOTP.Separator />
				<InputOTP.Group>
					{#each cells.slice(3, 6) as cell (cell)}
						<InputOTP.Slot {cell} />
					{/each}
				</InputOTP.Group>
			{/snippet}
		</InputOTP.Root>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Select</Card.Title>
	</Card.Header>
	<Card.Content>
		<Select.Root type="single" bind:value={selectedValue} {items}>
			<Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
			<Select.Content>
				{#each items as item}
					<Select.Item value={item.value}>{item.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Combobox</Card.Title>
	</Card.Header>
	<Card.Content>
		<Combobox
			name="test"
			items={[
				{ value: 1, label: "test" },
				{
					value: 2,
					label: "what",
				},
			]}
		/>
	</Card.Content>

	<Card.Root class="m-5">
		<Card.Header>
			<Card.Title>Basic</Card.Title>
		</Card.Header>
		<Card.Content class="flex flex-col gap-4">
			<div class="flex items-center space-x-2">
				<Switch id="switch" />
				<Label for="switch">Switch</Label>
			</div>
			<Toggle aria-label="toggle bold">Toggle</Toggle>

			<ToggleGroup.Root type="single">
				<ToggleGroup.Item value="a">A</ToggleGroup.Item>
				<ToggleGroup.Item value="b">B</ToggleGroup.Item>
				<ToggleGroup.Item value="c">C</ToggleGroup.Item>
			</ToggleGroup.Root>

			<Slider type="single" max={100} step={1} />

			<RadioGroup.Root value="option-one">
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="option-one" id="option-one" />
					<Label for="option-one">Option One</Label>
				</div>
				<div class="flex items-center space-x-2">
					<RadioGroup.Item value="option-two" id="option-two" />
					<Label for="option-two">Option Two</Label>
				</div>
			</RadioGroup.Root>

			<div class="flex items-center space-x-2">
				<Checkbox id="terms" aria-labelledby="terms-label" />
				<Label
					id="terms-label"
					for="terms"
					class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Accept terms and conditions
				</Label>
			</div>

			<Label
				class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
			>
				<Checkbox
					id="toggle-2"
					checked
					class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
				/>
				<div class="grid gap-1.5 font-normal">
					<p class="text-sm leading-none font-medium">Enable notifications</p>
					<p class="text-muted-foreground text-sm">You can enable or disable notifications at any time.</p>
				</div>
			</Label>
		</Card.Content>
	</Card.Root>
</Card.Root>
