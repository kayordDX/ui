export interface Employee {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	department: string;
	role: string;
	salary: number;
	status: "active" | "inactive";
}

const FIRST_NAMES = [
	"Aiden",
	"Bianca",
	"Caleb",
	"Daria",
	"Ethan",
	"Farah",
	"Gavin",
	"Hana",
	"Ivan",
	"Juno",
	"Kiran",
	"Lena",
	"Mateo",
	"Nadia",
	"Omar",
	"Priya",
	"Quinn",
	"Ravi",
	"Sara",
	"Tariq",
	"Uma",
	"Victor",
	"Wren",
	"Xena",
	"Yusuf",
	"Zara",
];
const LAST_NAMES = [
	"Adler",
	"Bauer",
	"Cohen",
	"Diaz",
	"Evans",
	"Frost",
	"Gupta",
	"Hahn",
	"Ito",
	"Jensen",
	"Khan",
	"Lopez",
	"Mason",
	"Nair",
	"Owens",
	"Patel",
	"Quinn",
	"Reyes",
	"Shah",
	"Tan",
	"Ueda",
	"Voss",
	"Wong",
	"Xu",
	"Yoon",
	"Zaid",
];
const DEPARTMENTS = ["Engineering", "Design", "Sales", "Marketing", "Support", "Finance", "HR", "Legal"];
const ROLES = ["Intern", "Junior", "Mid", "Senior", "Lead", "Director"];

// Deterministic PRNG so the dataset is stable across requests/restarts.
function mulberry32(seed: number): () => number {
	let a = seed;
	return () => {
		a |= 0;
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export const DATASET: Employee[] = (() => {
	const rand = mulberry32(42);
	const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
	const rows: Employee[] = [];
	for (let i = 0; i < 137; i++) {
		const first = pick(FIRST_NAMES);
		const last = pick(LAST_NAMES);
		rows.push({
			id: i + 1,
			firstName: first,
			lastName: last,
			email: `${first}.${last}.${i + 1}@example.com`.toLowerCase(),
			department: pick(DEPARTMENTS),
			role: pick(ROLES),
			salary: 40000 + Math.floor(rand() * 90000),
			status: rand() > 0.25 ? "active" : "inactive",
		});
	}
	return rows;
})();

function valueOf(e: Employee, id: string): string | number {
	return e[id as keyof Employee] as string | number;
}

export interface EmployeeQuery {
	q?: string;
	page?: number;
	size?: number;
	/** Comma-separated `{id}` / `-{id}` tokens, e.g. `name` or `-salary,id`. */
	sort?: string;
	filters?: { id: string; value: unknown }[];
}

export interface EmployeeResult {
	data: Employee[];
	total: number;
	page: number;
	size: number;
}

export function queryEmployees(query: EmployeeQuery): EmployeeResult {
	const q = (query.q ?? "").trim().toLowerCase();
	const page = Math.max(0, query.page ?? 0);
	const size = Math.max(1, query.size ?? 10);
	const filters = query.filters ?? [];

	let rows = DATASET.slice();

	if (q) {
		rows = rows.filter((e) =>
			[e.firstName, e.lastName, e.email, e.department, e.role, e.status].some((field) =>
				field.toLowerCase().includes(q)
			)
		);
	}

	for (const f of filters) {
		const v = String(f.value ?? "")
			.trim()
			.toLowerCase();
		if (!v) continue;
		rows = rows.filter((e) => String(valueOf(e, f.id)).toLowerCase().includes(v));
	}

	const total = rows.length;

	const sortParam = query.sort ?? "";
	if (sortParam) {
		for (const token of sortParam.split(",")) {
			if (!token) continue;
			const desc = token.startsWith("-");
			const id = desc ? token.slice(1) : token;
			rows.sort((a, b) => {
				const av = valueOf(a, id);
				const bv = valueOf(b, id);
				if (av < bv) return desc ? 1 : -1;
				if (av > bv) return desc ? -1 : 1;
				return 0;
			});
		}
	}

	const start = page * size;
	const data = rows.slice(start, start + size);

	return { data, total, page, size };
}
