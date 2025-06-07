import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import Page from "./+page.svelte";

describe("no initial dialog", () => {
	test("should not have default dialog", () => {
		const { container } = render(Page);
		expect(container.childElementCount).toBeGreaterThan(0);

		const button = screen.getAllByRole("button", { name: "Show Dialog" })[0];

		expect(button).toBeInTheDocument();

		const dialog = screen.queryByText("Are you absolutely sure?");
		expect(dialog).not.toBeInTheDocument();
	});
});

describe("show dialog", () => {
	test("should have dialog shown", async () => {
		const user = userEvent.setup();
		render(Page);

		const button = screen.getAllByRole("button", { name: "Show Dialog" })[0];
		await user.click(button);
		const dialog = screen.queryByText("Are you absolutely sure?");
		expect(dialog).toBeInTheDocument();
	});
});

// describe("/+page.svelte", () => {
// 	test("should render buttons", () => {
// 		render(Page);
// 		expect(screen.getByText("Button")).toBeInTheDocument();
// 	});
// });
