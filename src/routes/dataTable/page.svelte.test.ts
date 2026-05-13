import { describe, test, expect, vi } from "vitest";
import { render } from "vitest-browser-svelte";

vi.mock("$app/state", () => ({
	page: {
		url: new URL("http://localhost/dataTable"),
	},
}));

vi.mock("$lib/data-table", async () => {
	const { default: Skeleton } = await import("$lib/components/ui/skeleton/skeleton.svelte");

	return {
		DataTable: Skeleton,
		createShadTable: vi.fn(() => ({ options: {} })),
		renderSnippet: vi.fn(),
		renderComponent: vi.fn(),
	};
});

vi.mock("$lib/components/custom/data-table/shad-table.svelte", () => ({
	createShadTable: vi.fn(() => ({ options: {} })),
}));

describe("dataTable page", () => {
	test("should render tabs without crashing", async () => {
		const { default: Page } = await import("./+page.svelte");
		const { container } = render(Page);

		expect(container).toBeDefined();
		expect(container.childElementCount).toBeGreaterThan(0);
	});
});
