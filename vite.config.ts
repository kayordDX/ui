import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { type UserConfig } from "vite";
import { defineConfig } from "vitest/config";

const config: UserConfig = defineConfig({
	plugins: [sveltekit(), tailwindcss(), svelteTesting()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		environment: "happy-dom",
		setupFiles: ["./vitest-setup.ts"],

		// projects: [
		// 	{
		// 		extends: "./vite.config.ts",
		// 		plugins: [svelteTesting()],

		// 		test: {
		// 			name: "client",
		// 			environment: "happy-dom",
		// 			clearMocks: true,
		// 			include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
		// 			exclude: ["src/lib/server/**"],
		// 			setupFiles: ["./vitest-setup-client.ts"],
		// 		},
		// 	},
		// 	{
		// 		extends: "./vite.config.ts",

		// 		test: {
		// 			name: "server",
		// 			environment: "node",
		// 			include: ["src/**/*.{test,spec}.{js,ts}"],
		// 			exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
		// 		},
		// 	},
		// ],
	},
});

export default config;
