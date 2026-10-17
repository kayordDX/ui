export * as CodeBlock from "../components/ui/code-block/index.js";
export { useHighlightedCode } from "../hooks/use-highlighted-code.svelte.js";
export {
	highlightCode,
	loadHighlighter,
	type Highlighter,
	type HighlightedLine,
	type HighlightedToken,
} from "../highlighter.js";
