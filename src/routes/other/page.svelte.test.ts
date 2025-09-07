import { describe, test, expect } from "vitest";

import { render } from "@testing-library/svelte";
import Page from "./+page.svelte";

describe("/other/+page.svelte", () => {
	test("should render without crashing", () => {
		const { container } = render(Page);
		expect(container).toBeDefined();
		// expect(container.childElementCount).toBeGreaterThan(0);
	});
});
