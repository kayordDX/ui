import { describe, test, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import Page from "./+page.svelte";

describe("/+page.svelte", () => {
	test("should render something", () => {
		const { container } = render(Page);
		expect(container.childElementCount).toBeGreaterThan(0);
	});
});

// describe("/+page.svelte", () => {
// 	test("should render buttons", () => {
// 		render(Page);
// 		expect(screen.getByText("Button")).toBeInTheDocument();
// 	});
// });
