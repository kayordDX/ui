import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-svelte";

vi.mock("$app/state", () => ({
	page: {
		url: new URL("http://localhost/dataTable"),
	},
}));

vi.mock("$lib/data-table", async () => {
	const { default: Skeleton } = await import("$lib/components/ui/skeleton/skeleton.svelte");

	const atoms = () => ({
		globalFilter: { get: () => "" },
		sorting: { get: () => [] },
		pagination: { get: () => ({ pageIndex: 0, pageSize: 10 }) },
		columnFilters: { get: () => [] },
	});

	return {
		DataTable: Skeleton,
		createShadTable: vi.fn(() => ({ options: {}, atoms: atoms() })),
		createTableState: vi.fn(() => [() => ({}), vi.fn()]),
		useTableUrlSync: vi.fn(),
		renderSnippet: vi.fn(),
		renderComponent: vi.fn(),
	};
});

vi.mock("$lib/components/custom/data-table/shad-table.svelte", () => ({
	createShadTable: vi.fn(() => ({
		options: {},
		atoms: {
			globalFilter: { get: () => "" },
			sorting: { get: () => [] },
			pagination: { get: () => ({ pageIndex: 0, pageSize: 10 }) },
			columnFilters: { get: () => [] },
		},
	})),
}));

describe("dataTable page", () => {
	test("should render tabs without crashing", async () => {
		const { default: Page } = await import("./+page.svelte");
		const { container } = await render(Page);

		expect(container).toBeDefined();
		await vi.waitFor(() => expect(container.childElementCount).toBeGreaterThan(0));
	});
});
