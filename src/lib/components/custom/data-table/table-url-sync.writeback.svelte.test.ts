import { describe, test, expect, vi } from "vitest";
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

vi.mock("$app/environment", () => ({
	browser: true,
	building: false,
}));

import UrlSyncHarness from "./url-sync-harness.svelte";

const wait = () => new Promise((r) => setTimeout(r, 0));

describe("useTableUrlSync write-back", () => {
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
	});
});
