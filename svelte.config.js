import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
	kit: {
		alias: {
			$lib: "./src/lib",
		},
		adapter: adapter(),
		experimental: {
			remoteFunctions: true,
		},
	},
	vitePlugin: {
		inspector: {
			showToggleButton: "never",
		},
	},
};

export default config;
