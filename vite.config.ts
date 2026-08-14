/// <reference types="vitest/config" />
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		expect: { requireAssertions: true },
		// VM/CI-friendly execution: one worker, one test file at a time
		maxWorkers: 1,
		fileParallelism: false,
		watch: false,
		projects: [
			{
				extends: "./vite.config.ts",
				test: {
					name: "client",
					browser: {
						enabled: true,
						provider: playwright({
							launchOptions: {
								args: [
									"--disable-dev-shm-usage",
									"--no-sandbox",
									"--disable-gpu",
									"--single-process",
									"--disable-extensions",
									"--disable-background-networking",
									"--disable-sync",
									"--no-first-run",
									"--disable-breakpad",
								],
							},
						}),
						instances: [{ browser: "chromium", headless: true }],
					},
					include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
					exclude: ["src/lib/server/**"],
					setupFiles: ["./vitest-setup.ts"],
					css: true,
				},
			},
			{
				extends: "./vite.config.ts",
				test: {
					name: "server",
					environment: "node",
					include: ["src/**/*.{test,spec}.{js,ts}"],
					exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"],
				},
			},
		],
	},
});
