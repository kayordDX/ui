import type { ButtonVariant } from "$lib/components/ui/button";
import { type Icon } from "@lucide/svelte";
import type { Snippet } from "svelte";

export interface ActionType {
	text: string;
	icon?: typeof Icon;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	action?: (...args: any[]) => void;
	href?: string;
	class?: string;
}

export interface ActionGroupType {
	label: string;
	child?: Snippet;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ActionSeparatorType {}

export const isActionType = (action: ActionType | ActionGroupType | ActionSeparatorType): action is ActionType => {
	return "text" in action;
};

export const isActionGroup = (
	action: ActionType | ActionGroupType | ActionSeparatorType
): action is ActionGroupType => {
	return "label" in action;
};

export interface ActionsType {
	actions: Array<ActionType | ActionGroupType | ActionSeparatorType>;
	text?: string;
	icon?: typeof Icon;
	class?: string;
	variant?: ButtonVariant;
}
