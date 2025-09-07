import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	enumerable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock IntersectionObserver for test environment
class IntersectionObserverMock {
	constructor() {}
	observe() {}
	unobserve() {}
	disconnect() {}
}
globalThis.IntersectionObserver = globalThis.IntersectionObserver || IntersectionObserverMock;

// Mock ResizeObserver for test environment
class ResizeObserverMock {
	constructor() {}
	observe() {}
	unobserve() {}
	disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver || ResizeObserverMock;

// Polyfill scrollIntoView for Vitest/JSDOM
if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
	if (!window.HTMLElement.prototype.scrollIntoView) {
		window.HTMLElement.prototype.scrollIntoView = function () {
			// no-op for test environment
		};
	}
}

// Polyfill window.CSS.supports for Vitest/JSDOM
if (typeof window !== "undefined") {
	if (!window.CSS) {
		window.CSS = {} as any;
	}
	if (typeof window.CSS.supports !== "function") {
		window.CSS.supports = function () {
			// Always return true for test environment
			return true;
		};
	}
}

vi.mock("$app/navigation", () => ({
	goto: vi.fn(),
	beforeNavigate: vi.fn(),
}));
