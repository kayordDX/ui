# SvelteKit 3 compatibility

This project requires SvelteKit 3. Data-table URL syncing uses SvelteKit navigation directly, with `replace`/`reset` options and rejection handling. No Runed dependency or compatibility patch is required.

Superforms uses `3.0.0-next.1` without a compatibility patch. The demo's Zod adapter requires Zod 4.6 or newer.

The migration review found no mutation of `page.url` in `MenuItem.svelte`, no remaining authored `invalidateAll` calls, no `@migration-task` comments, and no cross-origin development static-asset requirement. Vite's default CORS policy is retained.
