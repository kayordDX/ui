import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import type { Navigation, Page } from "@sveltejs/kit";
import { readable } from "svelte/store";
import type * as environment from "$app/environment";
import type * as navigation from "$app/navigation";
import type * as stores from "$app/stores";

// ------------------ Browser API Mocks ------------------

// Mock ResizeObserver
if (typeof global !== "undefined") {
	global.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
}

// Mock IntersectionObserver
if (typeof global !== "undefined") {
	global.IntersectionObserver = class {
		public root: null = null;
		public rootMargin: string = "";
		public thresholds: number[] = [];
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() {
			return [];
		}
	};
}

// Mock scrollIntoView for all elements
if (typeof global !== "undefined") {
	const proto = global.HTMLElement ? global.HTMLElement.prototype : undefined;
	if (proto && !proto.scrollIntoView) {
		proto.scrollIntoView = function () {};
	}
}

// Mock window.CSS.supports
if (typeof window !== "undefined") {
	window.CSS = window.CSS || {};
	window.CSS.supports = window.CSS.supports || (() => true);
}

// Mock localStorage for test environment
if (typeof global !== "undefined") {
	global.localStorage = {
		_data: {},
		getItem(key) {
			return this._data[key] ?? null;
		},
		setItem(key, value) {
			this._data[key] = String(value);
		},
		removeItem(key) {
			delete this._data[key];
		},
		clear() {
			this._data = {};
		},
		key(n) {
			return Object.keys(this._data)[n] ?? null;
		},
		get length() {
			return Object.keys(this._data).length;
		},
	};
}

// ------------------ SvelteKit Runtime Mocks ------------------

vi.mock("$app/environment", (): typeof environment => ({
	browser: false,
	dev: true,
	building: false,
	version: "any",
}));

vi.mock("$app/navigation", (): typeof navigation => ({
	afterNavigate: () => {},
	beforeNavigate: () => {},
	disableScrollHandling: () => {},
	goto: () => Promise.resolve(),
	invalidate: () => Promise.resolve(),
	invalidateAll: () => Promise.resolve(),
	preloadData: () =>
		Promise.resolve({
			data: {},
			type: "loaded",
			status: 200,
		}),
	preloadCode: () => Promise.resolve(),
	onNavigate: () => {},
	pushState: () => {},
	replaceState: () => {},
	refreshAll: () => Promise.resolve(),
}));

vi.mock("$app/stores", (): typeof stores => {
	const getStores: typeof stores.getStores = () => {
		const navigating = readable<Navigation | null>(null);
		const page = readable<Page>({
			url: new URL("http://localhost"),
			params: {},
			route: { id: null },
			status: 200,
			error: null,
			data: {},
			form: undefined,
			state: {},
		});
		const updated = { subscribe: readable(false).subscribe, check: async () => false };
		return { navigating, page, updated };
	};
	return {
		getStores,
		navigating: { subscribe: (fn) => getStores().navigating.subscribe(fn) },
		page: { subscribe: (fn) => getStores().page.subscribe(fn) },
		updated: {
			subscribe: (fn) => getStores().updated.subscribe(fn),
			check: async () => false,
		},
	};
});

// ------------------ matchMedia Mock ------------------

export const mediaQueryState = { matches: false };
const listeners: ((event: unknown) => void)[] = [];
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: mediaQueryState.matches,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn((type, callback) => {
			if (type === "change") listeners.push(callback);
		}),
		removeEventListener: vi.fn((type, callback) => {
			const index = listeners.indexOf(callback);
			if (index !== -1) listeners.splice(index, 1);
		}),
		dispatchEvent: vi.fn((event) => {
			if (event.type === "change") {
				for (const callback of listeners) {
					callback({ matches: mediaQueryState.matches, media: "(prefers-color-scheme: light)" });
				}
			}
		}),
	})),
});
