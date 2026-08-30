import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";

// Captures the handler useTableUrlSync registers so tests can fire "external"
// navigations (links, back/forward, address bar) at the table.
const { handlers } = vi.hoisted(() => ({ handlers: [] as ((nav: { to: { url: URL } }) => void)[] }));

vi.mock("$app/state", () => ({
	page: {
		url: new URL("http://localhost/dataTable"),
	},
}));

vi.mock("$app/navigation", () => ({
	goto: vi.fn(() => Promise.resolve()),
	beforeNavigate: (handler: unknown) => handlers.push(handler as (nav: { to: { url: URL } }) => void),
}));

vi.mock("$app/environment", () => ({
	browser: true,
	building: false,
}));

import UrlSyncHarness from "./url-sync-harness.svelte";

const wait = () => new Promise((r) => setTimeout(r, 0));

/** Fires the registered beforeNavigate handler with a navigation to `href`. */
const navigateTo = async (href: string) => {
	const handler = handlers.at(-1)!;
	await handler({ to: { url: new URL(href) } });
	await tick();
	await wait();
};

describe("useTableUrlSync navigation (URL → table)", () => {
	test("applies sort/search/filter/page params from a new URL during a session", async () => {
		// renderTable renders the real DataTable so row-model auto-resets and
		// render flushes behave like they do in the app.
		const { component } = await render(UrlSyncHarness, { renderTable: true });
		await tick();
		await wait();

		await navigateTo("http://localhost/dataTable?search=alice&sort=-name&filter=day.%22Mon%22&page=2");

		expect(component.table.atoms.globalFilter.get()).toBe("alice");
		expect(component.table.atoms.sorting.get()).toEqual([{ id: "name", desc: true }]);
		expect(component.table.atoms.columnFilters.get()).toEqual([{ id: "day", value: "Mon" }]);
		expect(component.table.atoms.pagination.get().pageIndex).toBe(2);
	});

	test("a new sort snaps back to the first page when the URL has no page param", async () => {
		const { component } = await render(UrlSyncHarness, { renderTable: true });
		await tick();
		await wait();

		component.table.setPageIndex(2);
		await tick();
		await wait();

		await navigateTo("http://localhost/dataTable?sort=-name");
		await tick();
		await wait();

		expect(component.table.atoms.sorting.get()).toEqual([{ id: "name", desc: true }]);
		expect(component.table.atoms.pagination.get().pageIndex).toBe(0);
	});

	test("an explicit page param is honored when the query changes", async () => {
		const { component } = await render(UrlSyncHarness, { renderTable: true });
		await tick();
		await wait();

		await navigateTo("http://localhost/dataTable?sort=-name&page=3");
		await tick();
		await wait();

		expect(component.table.atoms.sorting.get()).toEqual([{ id: "name", desc: true }]);
		expect(component.table.atoms.pagination.get().pageIndex).toBe(3);
	});

	test("navigations started by the table's own write-back are ignored", async () => {
		const { component } = await render(UrlSyncHarness, { renderTable: false });
		await tick();
		await wait();

		// Sorting the table triggers a write-back. That navigation reaches
		// beforeNavigate with a URL that already matches the table state, so
		// nothing should be re-applied (and the page must not move).
		component.table.setSorting([{ id: "name", desc: true }]);
		component.table.setPageIndex(2);
		await tick();
		await wait();

		await navigateTo("http://localhost/dataTable?sort=-name&page=2");

		expect(component.table.atoms.sorting.get()).toEqual([{ id: "name", desc: true }]);
		expect(component.table.atoms.pagination.get().pageIndex).toBe(2);
	});
});
