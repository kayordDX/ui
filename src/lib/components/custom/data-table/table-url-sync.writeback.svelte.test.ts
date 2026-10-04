import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";

vi.mock("$app/state", () => ({
	page: {
		url: new URL("http://localhost/dataTable"),
	},
}));

vi.mock("$app/navigation", () => ({
	goto: vi.fn(() => Promise.resolve()),
	beforeNavigate: vi.fn(),
	afterNavigate: vi.fn(),
}));

import UrlSyncHarness from "./url-sync-harness.svelte";

const wait = () => new Promise((r) => setTimeout(r, 0));

describe("useTableUrlSync write-back", () => {
	beforeEach(async () => {
		const { page } = await import("$app/state");
		vi.mocked(page).url = new URL("http://localhost/dataTable");
		vi.clearAllMocks();
	});

	test("does not navigate when URL and table state already match", async () => {
		const { goto } = await import("$app/navigation");
		await render(UrlSyncHarness);
		await tick();
		expect(goto).not.toHaveBeenCalled();
	});

	test("preserves unrelated parameters and the hash", async () => {
		const { page } = await import("$app/state");
		const { goto } = await import("$app/navigation");
		vi.mocked(page).url = new URL("http://localhost/dataTable?view=compact#results");
		const { component } = await render(UrlSyncHarness);
		component.table.setGlobalFilter("alice");
		await tick();
		expect(goto).toHaveBeenLastCalledWith("?view=compact&search=alice#results", { replace: true, reset: false });
	});

	test("removes parameters when table state returns to defaults", async () => {
		const { page } = await import("$app/state");
		const { goto } = await import("$app/navigation");
		vi.mocked(page).url = new URL("http://localhost/dataTable?search=alice&page=2&sort=-name&view=compact");
		const { component } = await render(UrlSyncHarness);
		await tick();
		component.table.setGlobalFilter("");
		component.table.setSorting([]);
		component.table.setPageIndex(0);
		await tick();
		expect(goto).toHaveBeenLastCalledWith("?view=compact", { replace: true, reset: false });
	});

	test("writes table state back to the URL after hydration", async () => {
		const { goto } = await import("$app/navigation");
		vi.mocked(goto).mockClear();

		const { component } = await render(UrlSyncHarness);
		await tick();
		await wait();

		component.table.setSorting([{ id: "name", desc: true }]);
		component.table.setPageIndex(2);
		component.table.setGlobalFilter("alice");
		await tick();
		await wait();
		await tick();
		await wait();

		const urls = vi.mocked(goto).mock.calls.map((c) => c[0]);
		expect(urls.at(-1)).toContain("sort=-name");
		expect(urls.at(-1)).toContain("page=2");
		expect(urls.at(-1)).toContain("search=alice");
		expect(vi.mocked(goto).mock.calls.at(-1)?.[1]).toEqual({ replace: true, reset: false });
	});
});
