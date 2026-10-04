import { describe, test, expect } from "vitest";
import { render } from "vitest-browser-svelte";
import { userEvent } from "vitest/browser";
import "../../layout.css";

import Page from "./+page.svelte";

describe("no initial dialog", () => {
	test("should not have default dialog", async () => {
		const screen = await render(Page);
		expect(screen.container.childElementCount).toBeGreaterThan(0);

		const button = screen.getByRole("button", { name: "Show Dialog" }).first();

		expect(button).toBeInTheDocument();
		expect(button).toBeVisible();

		const dialog = screen.getByText("Are you absolutely sure?");
		expect(dialog).not.toBeInTheDocument();
	});
});

describe("drawer animation", () => {
	test("retains the final closing frame until the drawer is removed", async () => {
		const screen = await render(Page);
		await screen.getByRole("button", { name: "Open", exact: true }).first().click();
		const drawer = document.querySelector<HTMLElement>("[data-vaul-drawer]");
		const overlay = document.querySelector<HTMLElement>("[data-vaul-overlay]");
		expect(drawer).not.toBeNull();
		expect(overlay).not.toBeNull();
		await userEvent.keyboard("{Escape}");
		expect(drawer!.getAttribute("data-state")).toBe("closed");
		expect(getComputedStyle(drawer!).animationFillMode).toBe("forwards");
		expect(getComputedStyle(overlay!).animationFillMode).toBe("forwards");
		await expect.poll(() => drawer!.isConnected).toBe(false);
	});
});

describe("show dialog", () => {
	test("should have dialog shown", async () => {
		const screen = await render(Page);

		const button = screen.getByRole("button", { name: "Show Dialog" }).first();
		await button.click();
		const dialog = screen.getByText("Are you absolutely sure?");
		expect(dialog).toBeInTheDocument();
	});
});
