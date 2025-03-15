# Kayord UI

The UI components used to build kayord applications.

## Update

```bash
npx shadcn-svelte@latest

npx shadcn-svelte@latest update -a
```

## Installing

Pnpm command to install ui library.

```bash
# create a new project in the current directory
pnpm add -D @kayord/ui
# install peer dependencies
pnpm add -D @lucide-svelte zod sveltekit-superforms tailwindcss-animate
```

### Manual Setup New Project

```bash
# Setup new sveltekit project
npm create svelte@latest my-app
npx svelte-add@latest tailwindcss
pnpm i
```

### Add app.css and also include tailwindcss-animate

```css
@import "tailwindcss";
@import "./tailwindcss-animate.css";

@custom-variant dark (&:where(.dark, .dark *));

/* Button Defaults */
@layer base {
	button:not(:disabled),
	[role="button"]:not(:disabled) {
		cursor: pointer;
	}
}

:root {
	--accent-foreground: 240 5.9% 10%;
	--accent: 240 4.8% 95.9%;
	--background: 0 0% 100%;
	--border: 240 5.9% 90%;
	--card-foreground: 240 10% 3.9%;
	--card: 0 0% 100%;
	--destructive-foreground: 0 0% 98%;
	--destructive: 0 84.2% 60.2%;
	--foreground: 240 10% 3.9%;
	--input: 240 5.9% 90%;
	--muted-foreground: 240 3.8% 46.1%;
	--muted: 240 4.8% 95.9%;
	--popover-foreground: 240 10% 3.9%;
	--popover: 0 0% 100%;
	--primary-foreground: 0 0% 98%;
	--primary: 240 5.9% 10%;
	--radius: 0.5rem;
	--ring: 240 5.9% 10%;
	--secondary-foreground: 240 5.9% 10%;
	--secondary: 240 4.8% 95.9%;
	--sidebar-accent-foreground: 240 5.9% 10%;
	--sidebar-accent: 240 4.8% 95.9%;
	--sidebar-background: 0 0% 98%;
	--sidebar-border: 220 13% 91%;
	--sidebar-foreground: 240 5.3% 26.1%;
	--sidebar-primary-foreground: 0 0% 98%;
	--sidebar-primary: 232 27% 35%;
	--sidebar-ring: 217.2 91.2% 59.8%;
}
.dark {
	--background: 240 10% 3.9%;
	--foreground: 0 0% 98%;
	--card: 240 10% 3.9%;
	--card-foreground: 0 0% 98%;
	--popover: 240 10% 3.9%;
	--popover-foreground: 0 0% 98%;
	--primary: 0 0% 98%;
	--primary-foreground: 240 5.9% 10%;
	--secondary: 240 3.7% 15.9%;
	--secondary-foreground: 0 0% 98%;
	--muted: 240 3.7% 15.9%;
	--muted-foreground: 240 5% 64.9%;
	--accent: 240 3.7% 15.9%;
	--accent-foreground: 0 0% 98%;
	--destructive: 0 62.8% 30.6%;
	--destructive-foreground: 0 0% 98%;
	--border: 240 3.7% 15.9%;
	--input: 240 3.7% 15.9%;
	--ring: 240 4.9% 83.9%;
	--sidebar-background: 221, 40%, 8%;
	--sidebar-foreground: 240 4.8% 95.9%;
	--sidebar-primary: 232 27% 35%;
	--sidebar-primary-foreground: 0 0% 100%;
	--sidebar-accent: 221, 40%, 13%;
	--sidebar-accent-foreground: 240 4.8% 95.9%;
	--sidebar-border: 240 3.7% 15.9%;
	--sidebar-ring: 217.2 91.2% 59.8%;
}

@theme inline {
	/* Fonts */
	--font-sans:
		"Inter Variable", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
		"Noto Color Emoji";
	--font-mono:
		"Source Code Pro Variable", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
		monospace;

	/* Colors */
	--color-border: hsl(var(--border));
	--color-input: hsl(var(--input));
	--color-ring: hsl(var(--ring));
	--color-background: hsl(var(--background));
	--color-foreground: hsl(var(--foreground));
	--color-primary: hsl(var(--primary));
	--color-primary-foreground: hsl(var(--primary-foreground));
	--color-secondary: hsl(var(--secondary));
	--color-secondary-foreground: hsl(var(--secondary-foreground));
	--color-destructive: hsl(var(--destructive));
	--color-destructive-foreground: hsl(var(--destructive-foreground));
	--color-caution: var(--color-red-500);
	--color-warning: var(--color-amber-500);
	--color-info: var(--color-sky-500);
	--color-muted: hsl(var(--muted));
	--color-muted-foreground: hsl(var(--muted-foreground));
	--color-accent: hsl(var(--accent));
	--color-accent-foreground: hsl(var(--accent-foreground));
	--color-popover: hsl(var(--popover));
	--color-popover-foreground: hsl(var(--popover-foreground));
	--color-card: hsl(var(--card));
	--color-card-foreground: hsl(var(--card-foreground));
	--color-sidebar: hsl(var(--sidebar-background));
	--color-sidebar-foreground: hsl(var(--sidebar-foreground));
	--color-sidebar-primary: hsl(var(--sidebar-primary));
	--color-sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground));
	--color-sidebar-accent: hsl(var(--sidebar-accent));
	--color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
	--color-sidebar-border: hsl(var(--sidebar-border));
	--color-sidebar-ring: hsl(var(--sidebar-ring));

	/* Border */
	--radius-xl: calc(var(--radius) + 4px);
	--radius-lg: var(--radius);
	--radius-md: calc(var(--radius) - 2px);
	--radius-sm: calc(var(--radius) - 4px);

	/* Animations */
	--animate-accordion-down: 0.2s ease-out accordion-down;
	--animate-accordion-up: 0.2s ease-out accordion-up;
	--animate-caret-blink: 1.25s ease-out infinite caret-blink;

	/* Keyframes */
	@keyframes accordion-down {
		from: {
			height: 0;
		}
		to: {
			height: var(--bits-accordion-content-height);
		}
	}
	@keyframes accordion-up {
		from: {
			height: var(--bits-accordion-content-height);
		}
		to: {
			height: 0;
		}
	}
	@keyframes caret-blink {
		0%,
		70%,
		100% {
			opacity: 1;
		}
		20%,
		50% {
			opacity: 0;
		}
	}
}

@layer base {
	* {
		@apply border-border;
	}
	body {
		@apply bg-background text-foreground;
	}
}
```
