# Kayord UI

The UI components used to build kayord applications.

## Installing

Pnpm command to install ui library.

```bash
# create a new project in the current directory
pnpm add -D @kayord/ui
```

### Manual Setup New Project

```bash
# Setup new sveltekit project
npm create svelte@latest my-app

npx svelte-add@latest tailwindcss
pnpm i
```

### Change tailwind config

```js
// postcss.config.cjs

module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {}
	}
};
```

```ts
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { kayordPlugin } from "@kayord/ui";
// import forms from '@tailwindcss/forms';

export default {
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			fontFamily: {
				sans: [...fontFamily.sans],
			},
		},
	},
	plugins: [kayordPlugin],
} satisfies Config;

```