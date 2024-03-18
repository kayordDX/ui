import { render, screen } from "@testing-library/svelte";
import { expect, test } from "vitest";
import Main from "./+page.svelte";

test("Main Test", () => {
	const { container } = render(Main, {});
	expect(container.childElementCount).toBeGreaterThan(0);
});

test("Main Has Buttons", () => {
	render(Main, {});
	const buttons = screen.getByText("Buttons");
	expect(buttons).toBeInTheDocument();
});
