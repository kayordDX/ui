<script lang="ts">
	import { Tabs } from "$lib";
	import Example1 from "./Example1.svelte";
	import Example2 from "./Example2.svelte";
	import Example3 from "./Example3.svelte";
	import Example4 from "./Example4.svelte";
</script>

<Tabs.Root value="ex1">
	<Tabs.List class="mx-auto mt-2 flex flex-row items-center">
		<Tabs.Trigger value="ex1">Example 1</Tabs.Trigger>
		<Tabs.Trigger value="ex2">Example 2</Tabs.Trigger>
		<Tabs.Trigger value="ex3">Example 3</Tabs.Trigger>
		<Tabs.Trigger value="ex4">Example 4</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="ex1" class="w-full">
		<div class="m-4">
			<h2>Example 1</h2>
			<Example1 />
		</div>
	</Tabs.Content>
	<Tabs.Content value="ex2" class="w-full">
		<div class="m-4">
			<h2>Example 2</h2>
			<Example2 />
		</div>
	</Tabs.Content>
	<Tabs.Content value="ex3" class="w-full">
		<div class="m-4">
			<h2>Example 3</h2>
			<Example3 />
		</div>
	</Tabs.Content>
	<Tabs.Content value="ex4" class="w-full">
		<div class="m-4">
			<h2>Example 4</h2>
			<Example4 />
		</div>
	</Tabs.Content>
</Tabs.Root>
