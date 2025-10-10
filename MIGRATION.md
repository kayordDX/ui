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
