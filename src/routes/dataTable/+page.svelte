<script lang="ts">
	import { Tabs } from "$lib";
	import Example0 from "./Example0.svelte";
	import Example1 from "./Example1.svelte";
	import Example2 from "./Example2.svelte";
	import Example3 from "./Example3.svelte";
	import Example4 from "./Example4.svelte";
	import Example5 from "./Example5.svelte";
	import Example6 from "./Example6.svelte";
	import Example7 from "./Example7.svelte";
</script>

<Tabs.Root value="ex0">
	<Tabs.List class="mx-auto mt-2 flex flex-row items-center">
		<Tabs.Trigger value="ex0">Example 0</Tabs.Trigger>
		<Tabs.Trigger value="ex1">Example 1</Tabs.Trigger>
		<Tabs.Trigger value="ex2">Example 2</Tabs.Trigger>
		<Tabs.Trigger value="ex3">Example 3</Tabs.Trigger>
		<Tabs.Trigger value="ex4">Example 4</Tabs.Trigger>
		<Tabs.Trigger value="ex5">Example 5</Tabs.Trigger>
		<Tabs.Trigger value="ex6">Example 6</Tabs.Trigger>
		<Tabs.Trigger value="ex7">Example 7</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="ex0" class="w-full">
		<div class="m-4">
			<h2>Example 0</h2>
			<Example0 />
		</div>
	</Tabs.Content>
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
	<Tabs.Content value="ex5" class="w-full">
		<div class="w-full">
			<h2>Example 5 — Server-side data (search, sort, filter, paginate)</h2>
			<Example5 />
		</div>
	</Tabs.Content>
	<Tabs.Content value="ex6" class="w-full">
		<div class="m-4">
			<h2>Example 6 — Filter list (any column, operators, and/or)</h2>
			<Example6 />
		</div>
	</Tabs.Content>
	<Tabs.Content value="ex7" class="w-full">
		<div class="m-4">
			<h2>Example 7 — Filter list with QueryKit serialization (opt-in)</h2>
			<Example7 />
		</div>
	</Tabs.Content>
</Tabs.Root>
