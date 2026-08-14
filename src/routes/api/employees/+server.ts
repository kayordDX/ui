import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { queryEmployees } from "./employees";

export const GET: RequestHandler = ({ url }) => {
	const sort = url.searchParams.get("sort") ?? undefined;
	const q = url.searchParams.get("q") ?? undefined;

	let filters: { id: string; value: unknown }[] = [];
	try {
		const parsed = JSON.parse(url.searchParams.get("filters") ?? "[]");
		if (Array.isArray(parsed)) filters = parsed;
	} catch {
		filters = [];
	}

	const result = queryEmployees({
		q: q ?? "",
		page: Number(url.searchParams.get("page") ?? "0") || 0,
		size: Number(url.searchParams.get("size") ?? "10") || 10,
		sort,
		filters,
	});

	return json(result);
};
