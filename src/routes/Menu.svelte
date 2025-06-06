<script lang="ts">
	import MenuItem from "./MenuItem.svelte";
</script>

<div class="w-1/6 space-y-4 border-r-2 p-2 py-4">
	<MenuItem path="/" text="Home" />
	<MenuItem path="/info" text="Info" />
	<MenuItem path="/dialogs" text="Dialogs" />
	<MenuItem path="/other" text="Other" />
	<MenuItem path="/custom" text="Custom" />
	<MenuItem path="/dataTable" text="DataTable" />
	<MenuItem path="/forms" text="Forms" />
	<MenuItem path="/extras" text="Extras" />
	<MenuItem path="/charts" text="Charts" />
</div>
