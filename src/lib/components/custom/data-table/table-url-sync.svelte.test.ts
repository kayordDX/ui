import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";

vi.mock("$app/state", () => ({
	page: {
		url: new URL("http://localhost/dataTable?page=2&sort=-name&search=alice&filter=day.%22Mon%22"),
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

describe("useTableUrlSync", () => {
	test("hydrates table state from the URL on mount", async () => {
		const { component } = await render(UrlSyncHarness);
		await tick();
		await tick();

		expect(component.table.atoms.pagination.get().pageIndex).toBe(2);
		expect(component.table.atoms.sorting.get()).toEqual([{ id: "name", desc: true }]);
		expect(component.table.atoms.globalFilter.get()).toBe("alice");
		expect(component.table.atoms.columnFilters.get()).toEqual([{ id: "day", value: "Mon" }]);
	});
});
