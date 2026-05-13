import { afterEach, describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-svelte";

vi.mock("$app/state", () => ({
	page: {
		url: new URL("http://localhost/test"),
	},
}));

vi.mock("$lib/data-table", async () => {
	const { default: Skeleton } = await import("$lib/components/ui/skeleton/skeleton.svelte");

	return {
		DataTable: Skeleton,
		createShadTable: vi.fn(() => ({
			options: {},
			getState: () => ({
				globalFilter: "",
				pagination: { pageIndex: 0, pageSize: 10 },
				sorting: [],
				columnFilters: [],
			}),
			setGlobalFilter: vi.fn(),
			setColumnFilters: vi.fn(),
		})),
	};
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("/test/+page.svelte", () => {
	test("should render without crashing", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => ({
				json: async () => [],
			}))
		);

		const { default: Page } = await import("./+page.svelte");
		const { container } = render(Page);
		expect(container.childElementCount).toBeGreaterThan(0);
	});
});
