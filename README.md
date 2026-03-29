# Kayord UI

The UI components used to build kayord applications.

## Installing

Pnpm command to install ui library.

```bash
# create a new project in the current directory
pnpm add -D @kayord/ui
# install minimal dependencies
pnpm add -D @lucide/svelte tw-animate-css
# install other dependencies as required
pnpm add -D zod sveltekit-superforms
# include charts
pnpm add -D layerchart@next d3-scale d3-shape @types/d3-scale @types/d3-shape
```

## Peer Dependencies

Kayord UI exports components individually. Some components require additional peer dependencies. Install only those needed for the components you use.

### Core Peer Dependencies (required for most components)

- `svelte`
- `@lucide/svelte`
- `mode-watcher`

### Component-Specific Peer Dependencies

| Component/Feature               | Peer Dependencies to Install                                               |
| ------------------------------- | -------------------------------------------------------------------------- |
| **Charts** (`chart/`)           | `layerchart`, `d3-scale`, `d3-shape`, `@types/d3-scale`, `@types/d3-shape` |
| **Carousel** (`carousel/`)      | `embla-carousel-svelte`                                                    |
| **Data Table** (`data-table/`)  | `@tanstack/table-core`                                                     |
| **Drawer** (`drawer/`)          | `vaul-svelte`                                                              |
| **Form** (`form/`)              | `formsnap`, `sveltekit-superforms`                                         |
| **Date/Calendar** (`calendar/`) | `@internationalized/date`                                                  |
| **Resizable** (`resizable/`)    | `paneforge`                                                                |
| **Notifications** (`sonner/`)   | `svelte-sonner`                                                            |

> **Note:** All above dependencies are listed as optional peer dependencies. Only install those required for the components you use.

### Example Installation

```bash
# Core dependencies
pnpm add -D svelte @lucide/svelte tailwindcss-animate mode-watcher

# Most likely dependencies
pnpm add -D svelte @lucide/svelte tailwindcss-animate mode-watcher formsnap zod sveltekit-superforms @internationalized/date svelte-sonner

# For charts
pnpm add -D layerchart d3-scale d3-shape @types/d3-scale @types/d3-shape

# For carousel
pnpm add -D embla-carousel-svelte

# For data table
pnpm add -D @tanstack/table-core

# For drawer @next for now
pnpm add -D vaul-svelte@next

# For forms
pnpm add -D formsnap zod sveltekit-superforms

# For calendar/date
pnpm add -D @internationalized/date

# For resizable
pnpm add -D paneforge

# For notifications
pnpm add -D svelte-sonner
```

### Add app.css and also include tailwindcss-animate

```css
@import "tailwindcss";
@source "../node_modules/@kayord/ui";
@import "tw-animate-css";

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

	/* Custom Colors */
	--color-info: var(--chart-1);
	--color-success: var(--chart-2);
	--color-warning: var(--chart-3);

	/* Radius */
	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);
}

@layer base {
 * {
  @apply border-border;
 }
 body {
  @apply bg-background text-foreground;
 }
}

@custom-variant data-open {
	&:where([data-state="open"]),
	&:where([data-open]:not([data-open="false"])) {
		@slot;
	}
}

@custom-variant data-closed {
	&:where([data-state="closed"]),
	&:where([data-closed]:not([data-closed="false"])) {
		@slot;
	}
}

@custom-variant data-checked {
	&:where([data-state="checked"]),
	&:where([data-checked]:not([data-checked="false"])) {
		@slot;
	}
}

@custom-variant data-unchecked {
	&:where([data-state="unchecked"]),
	&:where([data-unchecked]:not([data-unchecked="false"])) {
		@slot;
	}
}

@custom-variant data-selected {
	&:where([data-selected]) {
		@slot;
	}
}

@custom-variant data-disabled {
	&:where([data-disabled="true"]),
	&:where([data-disabled]:not([data-disabled="false"])) {
		@slot;
	}
}

@custom-variant data-active {
	&:where([data-state="active"]),
	&:where([data-active]:not([data-active="false"])) {
		@slot;
	}
}

@custom-variant data-horizontal {
	&:where([data-orientation="horizontal"]) {
		@slot;
	}
}

@custom-variant data-vertical {
	&:where([data-orientation="vertical"]) {
		@slot;
	}
}

@utility no-scrollbar {
	-ms-overflow-style: none;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
}
```

## Data Table Types

```ts
// Add to app.d.ts
import { CustomOptions, CustomColumnMeta } from "@kayord/ui/data-table";

declare module "@tanstack/table-core" {
 interface ColumnMeta<TData extends RowData, TValue> extends CustomColumnMeta {}
 interface TableOptionsResolved<TData extends RowData> extends CustomOptions {}
}
```
