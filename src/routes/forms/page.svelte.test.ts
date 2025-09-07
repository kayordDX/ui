import { describe, test, expect, vi } from "vitest";

import { render } from "@testing-library/svelte";

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
	test("should render without crashing", () => {
		const { container } = render(Page, { props: { data: mockData } });
		expect(container.childElementCount).toBeGreaterThan(0);
	});
});
