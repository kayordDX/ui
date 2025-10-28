import { describe, test, expect } from "vitest";
import { render } from "vitest-browser-svelte";

// Patch HTMLFormElement.prototype.method to always return 'post' for the test
Object.defineProperty(HTMLFormElement.prototype, "method", {
	get() {
		return "post";
	},
});
import Page from "./+page.svelte";

// Provide a minimal SuperValidated mock object
const mockData = {
	id: "test",
	valid: true,
	posted: false,
	errors: {},
	data: { username: "" },
	shape: {},
};

describe("/forms/+page.svelte", () => {
	test("should render without crashing", async () => {
		const screen = render(Page, mockData);
		await screen.getByRole("form");
		expect(screen.container.childElementCount).toBeGreaterThan(0);
	});
});
