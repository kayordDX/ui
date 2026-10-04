# AGENTS.md

UI component library reused across apps. Components live in `src/lib/components/`.
This is shadcn-svelte but as a library.

## Commands

- `pnpm install` — install dependencies.
- `pnpm verify` — run all quality gates (check, lint, test) after every change.
- `pnpm format` — apply formatting.
- `pnpm dev` — run the demo app.

## Rules

- Do not add comments unless necessary.
- Use pnpm as the package manager.
- Never edit `src/lib/components/ui/`; regenerate it with `pnpm lib`.
- Follow existing patterns and run `pnpm verify` before finishing.
- Make sure `pnpm check` passes before committing.
