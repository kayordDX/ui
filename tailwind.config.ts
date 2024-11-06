import type { Config } from "tailwindcss";
import { kayordPlugin } from "@kayord/tw-plugin";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	safelist: ["dark"],
	theme: {},
	plugins: [kayordPlugin, tailwindcssAnimate],
};

export default config;
