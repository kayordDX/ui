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
pnpm add -D zod sveltekit-superforms
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
| **Data Table** (`data-table/`)  | `@tanstack/svelte-table`, `runed`, `zod`                                   |
| **Drawer** (`drawer/`)          | `vaul-svelte`                                                              |
| **Form** (`form/`)              | `formsnap`, `sveltekit-superforms`                                         |
| **Date/Calendar** (`calendar/`) | `@internationalized/date`                                                  |
| **Resizable** (`resizable/`)    | `paneforge`                                                                |
| **Notifications** (`sonner/`)   | `svelte-sonner`                                                            |

> **Note:** Optional peers are marked optional in `package.json`. The core peers (`svelte`, `@sveltejs/kit`, `@lucide/svelte`, and `mode-watcher`) are required. Install the others only if you use the corresponding feature.

### Example Installation

```bash
# Core dependencies
pnpm add -D svelte @sveltejs/kit @lucide/svelte tw-animate-css mode-watcher shadcn-svelte

# Most likely dependencies
pnpm add -D svelte @sveltejs/kit @lucide/svelte tw-animate-css mode-watcher formsnap zod sveltekit-superforms @internationalized/date svelte-sonner

# For charts
pnpm add -D layerchart d3-scale d3-shape @types/d3-scale @types/d3-shape

# For carousel
pnpm add -D embla-carousel-svelte

# For data table
pnpm add -D @tanstack/svelte-table runed zod

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

### Add app.css and also include tw-animate-css

```css
@import "tailwindcss";
@source "../node_modules/@kayord/ui";
@import "tw-animate-css";
@import "shadcn-svelte/tailwind.css";

@custom-variant dark (&:where(.dark, .dark *));

/* Button Defaults */
@layer base {
 button:not(:disabled),
 [role="button"]:not(:disabled) {
  cursor: pointer;
 }
}

@theme inline {
	--color-background: var(--background);
	--color-foreground: var(--foreground);
	--font-sans: "Inter Variable", sans-serif;
	--font-mono: var(--font-geist-mono);
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
	--radius-sm: calc(var(--radius) - 4px);
	--radius-md: calc(var(--radius) - 2px);
	--radius-lg: var(--radius);
	--radius-xl: calc(var(--radius) + 4px);
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

@layer base {
 * {
  @apply border-border;
 }
 body {
  @apply bg-background text-foreground;
 }
}
```

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
