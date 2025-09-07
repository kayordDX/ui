import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { svelteTesting } from "@testing-library/svelte/vite";
import { type UserConfig } from "vite";
import { defineConfig } from "vitest/config";

const config: UserConfig = defineConfig({
	plugins: [sveltekit(), tailwindcss(), svelteTesting()],
	test: {
		include: ["src/**/*.{test,spec}.{js,ts}"],
		environment: "jsdom",
		setupFiles: ["./vitest-setup.ts"],
	},
});

export default config;
