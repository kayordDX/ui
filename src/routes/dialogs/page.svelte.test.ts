import { describe, test, expect } from "vitest";
import { render } from "vitest-browser-svelte";

import Page from "./+page.svelte";

describe("no initial dialog", () => {
	test("should not have default dialog", async () => {
		const screen = render(Page);
		expect(screen.container.childElementCount).toBeGreaterThan(0);

		const button = screen.getByRole("button", { name: "Show Dialog" }).first();

		expect(button).toBeInTheDocument();
		expect(button).toBeVisible();

		const dialog = screen.getByText("Are you absolutely sure?");
		expect(dialog).not.toBeInTheDocument();
	});
});

describe("show dialog", () => {
	test("should have dialog shown", async () => {
		const screen = render(Page);

		const button = screen.getByRole("button", { name: "Show Dialog" }).first();
		await button.click();
		const dialog = screen.getByText("Are you absolutely sure?");
		expect(dialog).toBeInTheDocument();
	});
});
