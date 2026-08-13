import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { page, userEvent } from "vitest/browser";
import Harness from "./data-table-harness.svelte";

// DataTable.svelte pulls in SvelteKit navigation + the runed search-params
// helper. They are not relevant to these behaviour tests, so they are stubbed.
vi.mock("$app/state", () => ({
	page: { url: new URL("http://localhost/") },
}));
vi.mock("$app/navigation", () => ({
	beforeNavigate: () => {},
	onNavigate: () => {},
	goto: () => {},
}));
vi.mock("runed/kit", () => ({
	useSearchParams: () => ({ search: "", page: 0, sort: "", filter: "" }),
}));

const nameCells = (c: HTMLElement) =>
	[...c.querySelectorAll<HTMLElement>("tbody tr td:nth-child(2)")].map((td) => td.textContent?.trim() ?? "");

describe("DataTable (TanStack Table v9)", () => {
	test("sorting reorders rows by the clicked column", async () => {
		const { container } = await render(Harness);

		// Data order (unsorted): charlie, alice, eve, ...
		await expect.poll(() => nameCells(container)[0]).toBe("charlie");

		// The sort button lives in the "Name" column header.
		const sortButton = container.querySelector<HTMLElement>("thead th:nth-child(2) button");
		expect(sortButton).not.toBeNull();
		sortButton!.click(); // first click => ascending

		await expect.poll(() => nameCells(container)[0]).toBe("alice");
	});

	test("pagination moves to the next page", async () => {
		const { container } = await render(Harness);

		await expect.poll(() => nameCells(container).length).toBe(10); // default page size

		// Use a Playwright locator (auto-waits) rather than a snapshot element.
		await page.getByRole("button", { name: "Go to next page" }).click();

		await expect.poll(() => nameCells(container).length).toBe(2); // 12 rows => 10 + 2
	});

	test("column filter (search) narrows rows", async () => {
		const { container } = await render(Harness);

		await userEvent.fill(page.getByPlaceholder("search-name"), "alice");

		await expect.poll(() => nameCells(container)).toEqual(["alice", "alice"]);
	});

	test("global filter narrows rows across columns", async () => {
		const { container } = await render(Harness);

		await userEvent.fill(page.getByPlaceholder("global-filter"), "bob");

		await expect.poll(() => nameCells(container)).toEqual(["bob", "bob"]);
	});

	test("adding a record renders the new row", async () => {
		const { container } = await render(Harness);

		await page.getByRole("button", { name: "Add Record" }).click();

		// addRecord() prepends, so the new row is first on page 1.
		await expect.poll(() => nameCells(container)[0]).toBe("zebra-new");
	});
});
