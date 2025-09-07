import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";

import Page from "./+page.svelte";

describe("dataTable page", () => {
	test("should render tabs without crashing", () => {
		const { container } = render(Page);
		expect(container.childElementCount).toBeGreaterThan(0);
	});
});
