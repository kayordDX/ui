# SvelteKit 3 compatibility

This project requires SvelteKit 3. The demo uses temporary pnpm patches registered in `pnpm-workspace.yaml`:

- `patches/runed@0.37.1.patch` migrates search-param navigation to `replace`/`reset` and handles rejected navigation promises. Search-param updates target the current application route.
- `patches/sveltekit-superforms@2.31.0.patch` bridges `$app/state` to Superforms' store-based API and replaces its refresh call with `refreshAll`. The demo does not depend on refreshing clearing `page.state`.

These patches are not automatically applied when another application installs the published UI library. Applications using `useTableUrlSync` or Superforms must copy the relevant patches and `patchedDependencies` entries into their own pnpm project (using these exact dependency versions), until upstream releases support SvelteKit 3. Remove the patches only after verifying URL history behavior and form updates with compatible releases.

The migration review found no mutation of `page.url` in `MenuItem.svelte`, no remaining authored `invalidateAll` calls, no `@migration-task` comments, and no cross-origin development static-asset requirement. Vite's default CORS policy is retained.
