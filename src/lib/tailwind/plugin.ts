import plugin from "tailwindcss/plugin";
import type { ConfigOptions } from "./types";

const coreConfig = {
	theme: {
		extend: {
		}
	}
};

const kayordPlugin = plugin.withOptions<ConfigOptions>(
	() => {
		return ({ addBase, theme }) => {
			addBase({
				h1: { fontSize: theme("fontSize.2xl") },
				h2: { fontSize: theme("fontSize.xl") },
				h3: { fontSize: theme("fontSize.lg") },
			});
		}
	},
	() => {
		return { ...coreConfig };
	}
);

export { kayordPlugin }