# Migration Guide 3.x → 4.0.0 (TanStack Table v9)

Version 4 migrates the DataTable to **TanStack Table v9** (`@tanstack/svelte-table@9`,
the runes-native Svelte 5 adapter). This is a breaking change for consumers that use
`DataTable` / `createShadTable`.

Refer to the [official v9 Svelte migration guide](https://tanstack.com/table/latest/docs/framework/svelte/guide/migrating)
for the full background. The DataTable-specific changes are below.

## Dependencies

`@tanstack/table-core` is no longer a direct dependency — `@tanstack/svelte-table`
re-exports all of its types and brings it in transitively.

```bash
pnpm add @tanstack/svelte-table@^9
# @tanstack/table-core@^9 is pulled in automatically; remove any explicit ^8 dep
```

`@kayord/ui` now peer-depends on `@tanstack/svelte-table` `>= 9.0.0 < 10.0.0`.

## Imports

The custom adapter wrapper (`createSvelteTable`, the local `FlexRender`,
`render-helpers`) is gone — those names are now re-exported from
`@tanstack/svelte-table`. Existing imports from `@kayord/ui/data-table` keep
working:

```ts
import { DataTable, createShadTable, FlexRender, renderComponent, renderSnippet } from "@kayord/ui/data-table";
```

Removed exports:

- `createShadTableOld` — the legacy v8 implementation (incompatible with v9).
- `createSvelteTable` as a hand-rolled wrapper (it is now an alias for the
  official `createTable` from `@tanstack/svelte-table`).

## `createShadTable`

Row models are no longer passed as options. v9 registers everything through a
shared feature set, and `createShadTable` wires the row-model pipelines on demand
based on the `enable*` options (default on) — so you get the same behaviour with
less boilerplate.

```diff
  const table = createShadTable({
    columns,
    data,
-   getCoreRowModel: getCoreRowModel(),
-   getSortedRowModel: getSortedRowModel(),
-   getPaginationRowModel: getPaginationRowModel(),
-   getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
  });
```

Remove every `getCoreRowModel` / `getSortedRowModel` / `getPaginationRowModel` /
`getFilteredRowModel` import and option. To opt out of a pipeline, set the
corresponding flag instead (`enableSorting: false`, `enableFilters: false`,
`enablePaging: false`).

State is atom-backed in v9, so `createShadTable` returns the table directly —
there is no longer a manual reactivity wrapper. Controlled state
(`state` + `on*Change`) still works exactly as before; you can also let the table
own its state (uncontrolled) and lift only the slices you need with
`createTableState`:

```ts
import { createShadTable, createTableState } from "@kayord/ui/data-table";

const [rowSelection, onRowSelectionChange] = createTableState<RowSelectionState>({});

const table = createShadTable({
	columns,
	data,
	enableRowSelection: true,
	state: {
		get rowSelection() {
			return rowSelection();
		},
	},
	onRowSelectionChange,
});
```

Custom flags (`useURLSearchParams`, `enablePaging`) are now read from
`table.options.meta` instead of `table.options`. If you read them directly, update
those reads:

```diff
- if (table.options.useURLSearchParams) { ... }
+ if (table.options.meta?.useURLSearchParams) { ... }
```

## Column definitions & types

v9 requires the feature set as the first generic. The library exposes the
`DataTableFeatures` type (and the `features` value) so you can use the standard
TanStack types:

```diff
- import { type ColumnDef } from "@tanstack/table-core";
- const columns: ColumnDef<Row>[] = [ ... ];
+ import { type ColumnDef, type DataTableFeatures } from "@kayord/ui/data-table";
+ const columns: ColumnDef<DataTableFeatures, Row>[] = [ ... ];
```

If you used `columnDef.meta.className`, it still works (typed through the feature
set). Custom `sortFn` / `filterFn` strings resolve out of the box because the
built-in function registries are registered.

## Rendering (`FlexRender`)

Use the new element-based props instead of `content` / `context`:

```diff
- <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
+ <FlexRender {cell} />
- <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
+ <FlexRender {header} />
- <FlexRender content={header.column.columnDef.footer} context={header.getContext()} />
+ <FlexRender footer={header} />
```

## Reading state

`table.getState()` no longer exists in v9. Use the rune-aware store / atoms:

```diff
- const { pageIndex } = table.getState().pagination;
+ const { pageIndex } = table.atoms.pagination.get();
- const state = table.getState();
+ const state = table.store.get();
```

## Other v9 semantics

- Rename `sortingFn` → `sortFn` (and `sortingFns` → `sortFns`) in column defs.
- Column pinning uses logical `start` / `end` instead of `left` / `right`.
- `getIsSomePageRowsSelected()` now means “at least one row selected”, so an
  indeterminate select-all checkbox must be gated with
  `&& !table.getIsAllRowsSelected()`.
- Row/cell/column/header methods must be called on their instance (don't
  destructure `const { getValue } = row`; use `row.getValue(...)`).

---

# Migration Guide 1.0.0 - 2.0.0

Biggest change is the way imports are handled.
There are more libraries as peer dependencies but marked as optional.
When you are using the component that requires that library it should be added as a dependency.

Refer to [README](README.md)

## Steps to upgrade Existing Solution

### Forms

Search and Replace to below.

`import\s*\{[^}]*Form[^}]*\}\s*from\s*['"]@kayord/ui['"];`

`import { Form } from "@kayord/ui/form";`

### toast

Search and Replace

`import\s*\{[^}]*toast[^}]*\}\s*from\s*['"]@kayord/ui['"];`

`import { toast } from "@kayord/ui/sonner";`

### Calendar

Search and Replace

`import\s*\{[^}]*Calendar[^}]*\}\s*from\s*['"]@kayord/ui['"];`

`import { Calendar } from "@kayord/ui/calendar";`

### DataTable

Search and Replace

`import\s*\{[^}]*DataTable[^}]*\}\s*from\s*['"]@kayord/ui['"];`

`import { DataTable } from "@kayord/ui/data-table";`

`import { DataTable, createShadTable, renderComponent } from "@kayord/ui/data-table";`

This component has multiple other exports this is just to get the bulk of the imports.

### Chart

Search and Replace

`import\s*\{[^}]*Chart[^}]*\}\s*from\s*['"]@kayord/ui['"];`

`import { Chart } from "@kayord/ui/chart";`

### Carousel

Search and Replace

`import\s*\{[^}]*Carousel[^}]*\}\s*from\s*['"]@kayord/ui['"];`

`import { Carousel } from "@kayord/ui/carousel";`

### Mode Watcher

Install as dependency

```bash
pnpm add -D mode-watcher
```

Search and Replace

`@kayord/ui/mode-watcher`

`mode-watcher`

### Formsnap

Install dependency

```bash
pm add -D formsnap
```

Search and Replace

`@kayord/ui/formsnap`

`formsnap`
