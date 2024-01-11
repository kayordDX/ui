# Kayord UI

The UI components used to build kayord applications.

## Update

```bash
npx shadcn-svelte@latest

npx shadcn-svelte@latest update -a
```

## Installing

Pnpm command to install ui library.

```bash
# create a new project in the current directory
pnpm add -D @kayord/ui
pnpm add -D @kayord/tw-plugin
```

### Manual Setup New Project

```bash
# Setup new sveltekit project
npm create svelte@latest my-app
npx svelte-add@latest tailwindcss
pnpm i
```

### Change tailwind config

```js
// postcss.config.cjs

module.exports = {
 plugins: {
  tailwindcss: {},
  autoprefixer: {}
 }
};
```

```ts
// tailwind.config.ts

import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { kayordPlugin } from '@kayord/tw-plugin';

export default {
 darkMode: ["class"],
 content: ["./src/**/*.{html,js,svelte,ts}", "./node_modules/@kayord/ui/**/*.{html,js,svelte,ts}"],
 theme: {
  extend: {
   fontFamily: {
    sans: [...fontFamily.sans],
   },
  },
 },
 plugins: [kayordPlugin],
} satisfies Config;

```
