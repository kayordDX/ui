import { query } from "$app/server";
import z from "zod";
import { queryEmployees } from "./employees";

const getEmployeesSchema = z.object({
	q: z.string().optional(),
	page: z.number().int().min(0).optional(),
	size: z.number().int().min(1).optional(),
	/** Comma-separated `{id}` / `-{id}` tokens, e.g. `name` or `-salary,id`. */
	sort: z.string().optional(),
	filters: z.array(z.object({ id: z.string(), value: z.unknown() })).optional(),
});

/**
 * Remote query: runs on the server when called from the browser (SvelteKit
 * serializes the args and fetches the generated endpoint under the hood).
 * Args are validated against `getEmployeesSchema` before the handler runs.
 */
export const getEmployees = query(getEmployeesSchema, (args) => queryEmployees(args));
