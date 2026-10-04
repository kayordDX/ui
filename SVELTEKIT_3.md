# SvelteKit 3 compatibility

This project requires SvelteKit 3. The demo uses a temporary pnpm patch registered in `pnpm-workspace.yaml`:

- `patches/runed@0.37.1.patch` migrates search-param navigation to `replace`/`reset` and handles rejected navigation promises. Search-param updates target the current application route.

This patch is not automatically applied when another application installs the published UI library. Applications using `useTableUrlSync` must copy the Runed patch and its `patchedDependencies` entry into their own pnpm project (using this exact dependency version), until upstream releases support SvelteKit 3. Remove the patch only after verifying URL history behavior with a compatible release.

Superforms uses `3.0.0-next.1` without a compatibility patch. The demo's Zod adapter requires Zod 4.6 or newer.

The migration review found no mutation of `page.url` in `MenuItem.svelte`, no remaining authored `invalidateAll` calls, no `@migration-task` comments, and no cross-origin development static-asset requirement. Vite's default CORS policy is retained.
