import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";
import Page from "./+page.svelte";

describe("/more/+page.svelte", () => {
	test("renders without nested buttons and allows removing the React chip", async () => {
		const { container } = await render(Page);
		expect(container.querySelector("button button")).toBeNull();
		const removeButton = container.querySelector<HTMLButtonElement>('button[aria-label="Remove React"]');
		expect(removeButton).not.toBeNull();
		removeButton!.click();
		await tick();
		expect(container.querySelector('button[aria-label="Remove React"]')).toBeNull();
	});
});
