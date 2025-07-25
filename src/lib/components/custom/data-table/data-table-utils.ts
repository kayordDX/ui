const sum = <T>(data: T[], columnId: keyof T) => {
	return data.reduce((sum, next) => {
		const nextValue = next[columnId];
		return sum + (typeof nextValue === "number" ? nextValue : 0);
	}, 0);
};

const min = <T>(data: T[], columnId: keyof T) => {
	let min: number | undefined;

	data.forEach((row) => {
		const value = Number(row[columnId]);

		if (value != null && (min! > value || (min === undefined && value >= value))) {
			min = value;
		}
	});

	return min;
};

const max = <T>(data: T[], columnId: keyof T) => {
	let max: number | undefined;

	data.forEach((row) => {
		const value = Number(row[columnId]);
		if (value != null && (max! < value || (max === undefined && value >= value))) {
			max = value;
		}
	});

	return max;
};

const uniqueCount = <T>(data: T[], columnId: keyof T) => {
	return new Set(data.map((d) => d[columnId])).size;
};

const count = <T>(data: T[], columnId: keyof T) => {
	return data.length;
};

const mean = <T>(data: T[], columnId: keyof T) => {
	let count = 0;
	let sum = 0;

	data.forEach((row) => {
		let value = Number(row[columnId]);
		if (value != null && (value = +value) >= value) {
			(++count, (sum += value));
		}
	});

	if (count) return sum / count;

	return;
};

export const aggregationFns = {
	sum,
	min,
	max,
	mean,
	uniqueCount,
	count,
};
