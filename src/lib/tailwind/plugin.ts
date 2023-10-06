import plugin from "tailwindcss/plugin";

export const kayordPlugin = plugin(function ({ addBase, theme }) {
	addBase({
		h1: { fontSize: theme("fontSize.2xl") },
		h2: { fontSize: theme("fontSize.xl") },
		h3: { fontSize: theme("fontSize.lg") },
	});
});
