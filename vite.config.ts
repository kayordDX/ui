import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		environment: "happy-dom",
		globals: true,
		setupFiles: ["src/setupTest.js"],
	},

	resolve: {
		conditions: ["browser"],
	},
}));
