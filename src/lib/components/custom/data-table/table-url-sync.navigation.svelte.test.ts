import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";

interface MockNavigation {
	from: { url: URL } | null;
	to: { url: URL } | null;
}

const handlers = vi.hoisted(() => ({
	before: [] as Array<(navigation: unknown) => void>,
	after: [] as Array<(navigation: unknown) => void>,
}));

vi.mock("$app/state", () => ({
	page: {
		url: new URL("http://localhost/dataTable?page=2&sort=-name&search=alice&filter=day.%22Mon%22"),
	},
}));

vi.mock("$app/navigation", () => ({
	goto: vi.fn(() => Promise.resolve()),
	beforeNavigate: vi.fn((callback: (navigation: unknown) => void) => handlers.before.push(callback)),
	afterNavigate: vi.fn((callback: () => void) => handlers.after.push(callback)),
}));

vi.mock("$app/environment", () => ({
	browser: true,
	building: false,
}));

import UrlSyncHarness from "./url-sync-harness.svelte";

const wait = () => new Promise((r) => setTimeout(r, 0));

const tableRoute = (search = "?page=2&sort=-name&search=alice&filter=day.%22Mon%22") =>
	new URL(`http://localhost/dataTable${search}`);

const navigateBefore = (navigation: MockNavigation) => {
	for (const callback of handlers.before) callback(navigation);
};

const navigateAfter = () => {
	for (const callback of handlers.after) callback(undefined);
};

describe("useTableUrlSync navigation", () => {
	beforeEach(() => {
		handlers.before.length = 0;
		handlers.after.length = 0;
	});

	test("cross-route navigation does not reset the page or issue a competing goto", async () => {
		const { goto } = await import("$app/navigation");
		const { component } = await render(UrlSyncHarness);
		await tick();
		await tick();
		vi.mocked(goto).mockClear();

		navigateBefore({
			from: { url: tableRoute() },
			to: { url: new URL("http://localhost/bills/42") },
		});
		await tick();
		await wait();

		expect(component.table.atoms.pagination.get().pageIndex).toBe(2);
		expect(vi.mocked(goto)).not.toHaveBeenCalled();

		navigateAfter();
		expect(component.table.atoms.pagination.get().pageIndex).toBe(2);
	});

	test("write-back is suppressed while leaving and resumes after the navigation", async () => {
		const { goto } = await import("$app/navigation");
		const { component } = await render(UrlSyncHarness);
		await tick();
		await tick();
		vi.mocked(goto).mockClear();

		navigateBefore({
			from: { url: tableRoute() },
			to: { url: new URL("http://localhost/bills/42") },
		});

		component.table.setGlobalFilter("bob");
		await tick();
		await wait();
		await tick();
		await wait();
		expect(vi.mocked(goto)).not.toHaveBeenCalled();

		navigateAfter();
		component.table.setPageIndex(3);
		await tick();
		await wait();
		await tick();
		await wait();

		const urls = vi.mocked(goto).mock.calls.map((c) => c[0]);
		expect(urls.at(-1)).toContain("search=bob");
		expect(urls.at(-1)).toContain("page=3");
	});

	test("same-route query change still snaps back to page 1", async () => {
		const { goto } = await import("$app/navigation");
		const { component } = await render(UrlSyncHarness);
		await tick();
		await tick();
		vi.mocked(goto).mockClear();

		navigateBefore({
			from: { url: tableRoute() },
			to: { url: tableRoute("?search=7") },
		});
		await tick();
		await wait();

		expect(component.table.atoms.pagination.get().pageIndex).toBe(0);
		expect(vi.mocked(goto)).toHaveBeenCalled();
	});
});
