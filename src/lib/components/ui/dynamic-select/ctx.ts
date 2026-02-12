import { getContext, setContext } from "svelte";

const DYNAMIC_SELECT_KEY = Symbol("dynamic-select");

type DynamicSelectContext = {
	value: { value: string };
	open: { value: boolean };
	inputValue: { value: string };
	setValue: (v: string) => void;
};

export function setDynamicSelectContext(props: DynamicSelectContext) {
	setContext(DYNAMIC_SELECT_KEY, props);
}

export function getDynamicSelectContext() {
	return getContext<DynamicSelectContext>(DYNAMIC_SELECT_KEY);
}
