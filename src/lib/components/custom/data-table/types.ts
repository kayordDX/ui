import z from "zod";

export interface CustomOptions {
	useURLSearchParams?: boolean;
}

export interface CustomColumnMeta {
	className?: string;
}

export const defaultSearchParamSchema = z.object({
	search: z.any().default(""),
	page: z.coerce.number().default(0),
	filter: z.string().default(""),
	sort: z.string().default(""),
});

export type SearchParamSchema = z.infer<typeof defaultSearchParamSchema>;
