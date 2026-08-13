import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { userEvent } from "vitest/browser";
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

const buttonByText = (c: HTMLElement, text: string) =>
	[...c.querySelectorAll<HTMLButtonElement>("button")].find((b) => (b.textContent ?? "").includes(text));

describe("DataTable (TanStack Table v9)", () => {
	test("sorting reorders rows by the clicked column", async () => {
		const { container } = await render(Harness);

		// Data order (unsorted): charlie, alice, eve, ...
		await expect.poll(() => nameCells(container)[0]).toBe("charlie");

		const sortButton = container.querySelector<HTMLElement>("thead th:nth-child(2) button");
		expect(sortButton).not.toBeNull();
		sortButton!.click(); // first click => ascending

		await expect.poll(() => nameCells(container)[0]).toBe("alice");
	});

	test("pagination moves to the next page", async () => {
		const { container } = await render(Harness);

		await expect.poll(() => nameCells(container).length).toBe(10); // default page size

		const next = buttonByText(container, "Go to next page")!;
		await userEvent.click(next);

		await expect.poll(() => nameCells(container).length).toBe(2); // 12 rows => 10 + 2
	});

	test("column filter (search) narrows rows", async () => {
		const { container } = await render(Harness);

		const input = container.querySelector<HTMLInputElement>('input[placeholder="search-name"]')!;
		await userEvent.fill(input, "alice");

		await expect.poll(() => nameCells(container)).toEqual(["alice", "alice"]);
	});

	test("global filter narrows rows across columns", async () => {
		const { container } = await render(Harness);

		const input = container.querySelector<HTMLInputElement>('input[placeholder="global-filter"]')!;
		await userEvent.fill(input, "bob");

		await expect.poll(() => nameCells(container)).toEqual(["bob", "bob"]);
	});

	test("adding a record renders the new row", async () => {
		const { container } = await render(Harness);

		const add = buttonByText(container, "Add Record")!;
		await userEvent.click(add);

		// addRecord() prepends, so the new row is first on page 1.
		await expect.poll(() => nameCells(container)[0]).toBe("zebra-new");
	});
});
