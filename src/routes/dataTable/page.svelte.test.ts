import { describe, test, expect } from "vitest";
import { render } from "vitest-browser-svelte";

import Page from "./+page.svelte";

describe("dataTable page", () => {
	test("should render tabs without crashing", async () => {
		const { container } = render(Page);
		expect(container).toBeDefined();
		expect(container.childElementCount).toBeGreaterThan(0);
	});
});
