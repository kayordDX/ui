import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-svelte";

// Mock createShadTable to always set useURLSearchParams: false
vi.mock("$lib/data-table", async (orig) => {
	const mod: any = await orig();
	return {
		...mod,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		createShadTable: (opts: any) => mod.createShadTable({ ...opts, useURLSearchParams: false }),
	};
});

import Page from "./+page.svelte";

describe("dataTable page", () => {
	test("should render tabs without crashing", async () => {
		const { container } = render(Page);
		expect(container).toBeDefined();
		expect(container.childElementCount).toBeGreaterThan(0);
	});
});
