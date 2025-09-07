# Copilot Instructions for Kayord UI

## Project Overview

- **Kayord UI** is a SvelteKit-based component library for building modern UIs, with a focus on composability, accessibility, and themeability.
- Components are organized under `src/lib/components/ui/` (core UI) and `src/lib/components/custom/` (project-specific or extended components).
- The project uses Tailwind CSS (with custom themes and variants), and leverages `@lucide/svelte` for icons, `zod` for validation, and `sveltekit-superforms` for forms.

## Key Patterns & Conventions

- **Component Structure:**
  - Each component is a Svelte file, often wrapping a primitive from `bits-ui` and applying custom styles/slots.
  - Use the `cn` utility from `$lib/utils.js` for conditional class names.
  - Data attributes (e.g., `data-slot`, `data-orientation`) are used for styling and state.
- **Styling:**
  - Global styles in `src/app.css` define color variables and custom variants (e.g., `@custom-variant dark`).
  - Always import `app.css` and `tailwindcss-animate` in new projects.
- **Theming:**
  - Color and radius variables are defined in `:root` and `.dark` selectors in `app.css`.
  - Use CSS variables for all color and spacing values in components.
- **Component Usage:**
  - Import components from `$lib` (e.g., `import { Button, Card } from "$lib"`).
  - Many components are compound (e.g., `Card.Root`, `Card.Header`, `Card.Content`).
  - Use `data-slot` and `class` props to customize appearance and behavior.
- **TypeScript:**
  - Types for data tables and forms are extended via module augmentation (see `README.md` Data Table Types section).

## Developer Workflows

- **Install dependencies:**
  - `pnpm add -D @kayord/ui @lucide/svelte zod sveltekit-superforms tailwindcss-animate`
  - For charts: `pnpm add -D layerchart@next d3-scale d3-shape @types/d3-scale @types/d3-shape`
- **Update components:**
  - Use `npx shadcn-svelte@latest` and `npx shadcn-svelte@latest update -a` for updates.
- **Build/Test:**
  - Standard SvelteKit build/test commands apply (`pnpm dev`, `pnpm build`, `pnpm test`).
  - Tests are in `src/routes/*/*.test.ts` and use Vitest.
- **Manual Project Setup:**
  - See `README.md` for new project setup, including SvelteKit and Tailwind integration.

## Integration & Extensibility

- **External Primitives:**
  - Many UI components wrap primitives from `bits-ui` for accessibility and state management.
- **Icons:**
  - Use `@lucide/svelte` icons, imported directly in Svelte files.
- **Forms:**
  - Use `sveltekit-superforms` and `zod` for form validation and handling.
- **Charts:**
  - Chart components are in `src/lib/components/ui/chart/` and require extra dependencies.

## Examples & References

- See `src/routes/+page.svelte` and other route files for usage examples.
- Refer to `src/app.css` for theming and custom variant patterns.
- For custom data table types, see the Data Table Types section in `README.md`.

---

**When contributing code:**

- Follow the established component structure and naming conventions.
- Use CSS variables and data attributes for all styling and state.
- Prefer composition and slot-based APIs for new components.
- Reference and update this file as new patterns emerge.
