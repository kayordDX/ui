export const sum = <T>(data: T[], columnId: keyof T) => {
	return data.reduce((total, row) => {
		const value = row[columnId];
		return total + (typeof value === "number" && Number.isFinite(value) ? value : 0);
	}, 0);
};

export const min = <T>(data: T[], columnId: keyof T) => {
	let min: number | undefined;

	for (const row of data) {
		const value = row[columnId];
		if (typeof value === "number" && Number.isFinite(value) && (min === undefined || value < min)) {
			min = value;
		}
	}

	return min;
};

export const max = <T>(data: T[], columnId: keyof T) => {
	let max: number | undefined;

	for (const row of data) {
		const value = row[columnId];
		if (typeof value === "number" && Number.isFinite(value) && (max === undefined || value > max)) {
			max = value;
		}
	}

	return max;
};

export const uniqueCount = <T>(data: T[], columnId: keyof T) => {
	return new Set(data.map((d) => d[columnId])).size;
};

export const count = <T>(data: T[], _columnId: keyof T) => {
	return data.length;
};

export const mean = <T>(data: T[], columnId: keyof T) => {
	let count = 0;
	let total = 0;

	for (const row of data) {
		const value = row[columnId];
		if (typeof value === "number" && Number.isFinite(value)) {
			count += 1;
			total += value;
		}
	}

	return count > 0 ? total / count : undefined;
};

export const aggregationFns = {
	sum,
	min,
	max,
	mean,
	uniqueCount,
	count,
};
