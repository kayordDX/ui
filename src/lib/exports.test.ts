import { describe, expect, it } from "vitest";
import { Attachment, Bubble, Marker, Message, Trace } from "./index.js";
import { CodeBlock, highlightCode, loadHighlighter, useHighlightedCode } from "./code-block/index.js";

describe("public component exports", () => {
	it.each([
		["Attachment", Attachment],
		["Bubble", Bubble],
		["Marker", Marker],
		["Message", Message],
		["Trace", Trace],
		["CodeBlock", CodeBlock],
	])("exposes the %s component group", (_, components) => {
		expect(components.Root).toBeTypeOf("function");
	});

	it("exposes highlighting helpers from the code-block entry point", () => {
		expect(useHighlightedCode).toBeTypeOf("function");
		expect(loadHighlighter).toBeTypeOf("function");
		expect(highlightCode).toBeTypeOf("function");
	});

	it("highlights code with the optional Shiki dependency", async () => {
		const lines = await highlightCode("const value = 1;", "typescript");
		expect(lines).toHaveLength(1);
		expect(lines?.[0]).toEqual(expect.arrayContaining([expect.objectContaining({ content: "const" })]));
	});
});
