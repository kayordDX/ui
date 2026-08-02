import { describe, test, expect } from "vitest";

import { render } from "vitest-browser-svelte";
import Page from "./+page.svelte";

describe("/other/+page.svelte", () => {
	test("should render without crashing", async () => {
		const { container } = await render(Page);
		expect(container).toBeDefined();
		// expect(container.childElementCount).toBeGreaterThan(0);
	});
});
