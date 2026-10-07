# Kayord UI

The UI components used to build kayord applications.

## Installing

Pnpm command to install ui library.

```bash
# create a new project in the current directory
pnpm add -D @kayord/ui
# install minimal dependencies
pnpm add -D @lucide/svelte tw-animate-css shadcn-svelte
# install other dependencies as required
pnpm add -D zod sveltekit-superforms@next
# include charts
pnpm add -D layerchart@next d3-scale d3-shape @types/d3-scale @types/d3-shape
```

## Peer Dependencies

Kayord UI exports components individually. Some components require additional peer dependencies. Install only those needed for the components you use.

### Core Peer Dependencies (required for most components)

- `svelte`
- `@sveltejs/kit`
- `@lucide/svelte`
- `mode-watcher`

### Component-Specific Peer Dependencies

| Component/Feature               | Peer Dependencies to Install                                               |
| ------------------------------- | -------------------------------------------------------------------------- |
| **Charts** (`chart/`)           | `layerchart`, `d3-scale`, `d3-shape`, `@types/d3-scale`, `@types/d3-shape` |
| **Carousel** (`carousel/`)      | `embla-carousel-svelte`                                                    |
| **Data Table** (`data-table/`)  | `@tanstack/svelte-table`, `zod`                                             |
| **Drawer** (`drawer/`)          | `vaul-svelte`                                                              |
| **Form** (`form/`)              | `formsnap`, `sveltekit-superforms`                                         |
| **Date/Calendar** (`calendar/`) | `@internationalized/date`                                                  |
| **Resizable** (`resizable/`)    | `paneforge`                                                                |
| **Notifications** (`sonner/`)   | `svelte-sonner`                                                            |

**Message Scroller** (`@kayord/ui/message-scroller`) and **Questionnaire** (`@kayord/ui/questionnaire`) require the optional peer `@shadcn-svelte/primitives`:

```bash
pnpm add -D @shadcn-svelte/primitives
```

```ts
import { MessageScroller } from "@kayord/ui/message-scroller";
import { Questionnaire } from "@kayord/ui/questionnaire";
```

> **Note:** Optional peers are marked optional in `package.json`. The core peers (`svelte`, `@sveltejs/kit`, `@lucide/svelte`, and `mode-watcher`) are required. Install the others only if you use the corresponding feature.

### Example Installation

```bash
# Core dependencies
pnpm add -D svelte @sveltejs/kit @lucide/svelte tw-animate-css mode-watcher shadcn-svelte

# Most likely dependencies
pnpm add -D svelte @sveltejs/kit @lucide/svelte tw-animate-css mode-watcher formsnap zod sveltekit-superforms@next @internationalized/date svelte-sonner

# For charts
pnpm add -D layerchart d3-scale d3-shape @types/d3-scale @types/d3-shape

# For carousel
pnpm add -D embla-carousel-svelte

# For data table
pnpm add -D @tanstack/svelte-table zod

# For drawer @next for now
pnpm add -D vaul-svelte@next

# For forms
pnpm add -D formsnap zod sveltekit-superforms@next

# For calendar/date
pnpm add -D @internationalized/date

# For resizable
pnpm add -D paneforge

# For notifications
pnpm add -D svelte-sonner
```

### Global stylesheet

Add this to your app's global stylesheet and import it from your root layout. This example follows [`src/layout.css`](src/layout.css): imports, dark variant, closing-animation defaults, button defaults, light/dark tokens, Tailwind theme mappings, and base styles.

The `@source` path assumes the stylesheet lives in `src/`; adjust it if your stylesheet is elsewhere.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn-svelte/tailwind.css";
@source "../node_modules/@kayord/ui";

@custom-variant dark (&:is(.dark *));

[data-state="closed"] {
	animation-fill-mode: forwards;
}

/* Button Defaults */
@layer base {
	button:not(:disabled),
	[role="button"]:not(:disabled) {
		cursor: pointer;
	}
}

:root {
	--radius: 0.5rem;
	--background: oklch(1 0 0);
	--foreground: oklch(0.141 0.005 285.823);
	--card: oklch(1 0 0);
	--card-foreground: oklch(0.141 0.005 285.823);
	--popover: oklch(1 0 0);
	--popover-foreground: oklch(0.141 0.005 285.823);
	--primary: oklch(0.21 0.006 285.885);
	--primary-foreground: oklch(0.985 0 0);
	--secondary: oklch(0.967 0.001 286.375);
	--secondary-foreground: oklch(0.21 0.006 285.885);
	--muted: oklch(0.967 0.001 286.375);
	--muted-foreground: oklch(0.552 0.016 285.938);
	--accent: oklch(0.967 0.001 286.375);
	--accent-foreground: oklch(0.21 0.006 285.885);
	--destructive: oklch(0.577 0.245 27.325);
	--border: oklch(0.92 0.004 286.32);
	--input: oklch(0.92 0.004 286.32);
	--ring: oklch(0.705 0.015 286.067);
	--chart-1: oklch(0.646 0.222 41.116);
	--chart-2: oklch(0.6 0.118 184.704);
	--chart-3: oklch(0.398 0.07 227.392);
	--chart-4: oklch(0.828 0.189 84.429);
	--chart-5: oklch(0.769 0.188 70.08);
	--sidebar: oklch(0.985 0 0);
	--sidebar-foreground: oklch(0.141 0.005 285.823);
	--sidebar-primary: oklch(0.21 0.006 285.885);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.967 0.001 286.375);
	--sidebar-accent-foreground: oklch(0.21 0.006 285.885);
	--sidebar-border: oklch(0.92 0.004 286.32);
	--sidebar-ring: oklch(0.705 0.015 286.067);
}
.dark {
	--background: oklch(0.141 0.005 285.823);
	--foreground: oklch(0.985 0 0);
	--card: oklch(0.21 0.006 285.885);
	--card-foreground: oklch(0.985 0 0);
	--popover: oklch(0.21 0.006 285.885);
	--popover-foreground: oklch(0.985 0 0);
	--primary: oklch(0.92 0.004 286.32);
	--primary-foreground: oklch(0.21 0.006 285.885);
	--secondary: oklch(0.274 0.006 286.033);
	--secondary-foreground: oklch(0.985 0 0);
	--muted: oklch(0.274 0.006 286.033);
	--muted-foreground: oklch(0.705 0.015 286.067);
	--accent: oklch(0.274 0.006 286.033);
	--accent-foreground: oklch(0.985 0 0);
	--destructive: oklch(0.704 0.191 22.216);
	--border: oklch(1 0 0 / 10%);
	--input: oklch(1 0 0 / 15%);
	--ring: oklch(0.552 0.016 285.938);
	--chart-1: oklch(0.488 0.243 264.376);
	--chart-2: oklch(0.696 0.17 162.48);
	--chart-3: oklch(0.769 0.188 70.08);
	--chart-4: oklch(0.627 0.265 303.9);
	--chart-5: oklch(0.645 0.246 16.439);
	--sidebar: oklch(0.21 0.006 285.885);
	--sidebar-foreground: oklch(0.985 0 0);
	--sidebar-primary: oklch(0.488 0.243 264.376);
	--sidebar-primary-foreground: oklch(0.985 0 0);
	--sidebar-accent: oklch(0.274 0.006 286.033);
	--sidebar-accent-foreground: oklch(0.985 0 0);
	--sidebar-border: oklch(1 0 0 / 10%);
	--sidebar-ring: oklch(0.552 0.016 285.938);
}

@theme inline {
	--font-sans: "Inter Variable", sans-serif;
	--color-sidebar-ring: var(--sidebar-ring);
	--color-sidebar-border: var(--sidebar-border);
	--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
	--color-sidebar-accent: var(--sidebar-accent);
	--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
	--color-sidebar-primary: var(--sidebar-primary);
	--color-sidebar-foreground: var(--sidebar-foreground);
	--color-sidebar: var(--sidebar);
	--color-chart-5: var(--chart-5);
	--color-chart-4: var(--chart-4);
	--color-chart-3: var(--chart-3);
	--color-chart-2: var(--chart-2);
	--color-chart-1: var(--chart-1);
	--color-ring: var(--ring);
	--color-input: var(--input);
	--color-border: var(--border);
	--color-destructive: var(--destructive);
	--color-accent-foreground: var(--accent-foreground);
	--color-accent: var(--accent);
	--color-muted-foreground: var(--muted-foreground);
	--color-muted: var(--muted);
	--color-secondary-foreground: var(--secondary-foreground);
	--color-secondary: var(--secondary);
	--color-primary-foreground: var(--primary-foreground);
	--color-primary: var(--primary);
	--color-popover-foreground: var(--popover-foreground);
	--color-popover: var(--popover);
	--color-card-foreground: var(--card-foreground);
	--color-card: var(--card);
	--color-foreground: var(--foreground);
	--color-background: var(--background);
	--radius-sm: calc(var(--radius) * 0.6);
	--radius-md: calc(var(--radius) * 0.8);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) * 1.4);
	--radius-2xl: calc(var(--radius) * 1.8);
	--radius-3xl: calc(var(--radius) * 2.2);
	--radius-4xl: calc(var(--radius) * 2.6);
}

@layer base {
	* {
		@apply border-border outline-ring/50;
	}
	body {
		@apply bg-background text-foreground;
	}
	html {
		@apply font-sans;
	}
}
```

The closing-animation rule prevents a final-frame flash before components unmount. Keep it outside `@layer base` so animation utilities do not override it. See [SvelteKit 3 compatibility](SVELTEKIT_3.md#exit-animation-flashes) for the confirmed cause and upgrade caveat.

## Data Table Types

v9 types column/table metadata through the library's feature set, so **no
`app.d.ts` module augmentation is needed**. Type your columns and tables with
the exported `DataTableFeatures`:

```ts
import {
	createShadTable,
	type ColumnDef,
	type DataTableFeatures,
} from "@kayord/ui/data-table";

interface Row {
	id: number;
	name: string;
}

const columns: ColumnDef<DataTableFeatures, Row>[] = [
	{ accessorKey: "id", header: "ID" },
	{ accessorKey: "name", header: "Name" },
];

const table = createShadTable({ columns, data });
```

Per-column `meta.className` and the table flags (`useURLSearchParams`,
`enablePaging`) are typed automatically through the feature set.
