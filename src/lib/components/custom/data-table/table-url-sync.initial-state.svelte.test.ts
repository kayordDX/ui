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

import UrlSyncHarness from "./url-sync-initial-state-harness.svelte";

const wait = () => new Promise((r) => setTimeout(r, 0));

describe("useTableUrlSync with initialState", () => {
	test("keeps initialState when the URL carries no table params", async () => {
		const { component } = await render(UrlSyncHarness);
		await tick();
		await tick();

		expect(component.table.atoms.sorting.get()).toEqual([{ id: "name", desc: false }]);
		expect(component.table.atoms.pagination.get().pageIndex).toBe(1);
	});

	test("writes initialState back to the URL", async () => {
		const { goto } = await import("$app/navigation");
		const { component } = await render(UrlSyncHarness);
		await tick();
		await wait();
		await tick();
		await wait();

		const urls = vi.mocked(goto).mock.calls.map((c) => c[0]);
		expect(urls.at(-1)).toContain("sort=name");
		expect(urls.at(-1)).toContain("page=1");
		expect(component.table.atoms.sorting.get()).toEqual([{ id: "name", desc: false }]);
		expect(component.table.atoms.pagination.get().pageIndex).toBe(1);
	});
});
