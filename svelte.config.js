import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			// `await` in `$derived(await ...)` (used by the server-data table example)
			async: true,
		},
	},
	kit: {
		alias: {
			$lib: "./src/lib",
		},
		adapter: adapter(),
	},
	vitePlugin: {
		inspector: {
			showToggleButton: "never",
		},
	},
};

export default config;
