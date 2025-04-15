export const sum = <T>(data: T[], columnId: keyof T) => {
	return data.reduce((sum, next) => {
		const nextValue = next[columnId];
		return sum + (typeof nextValue === "number" ? nextValue : 0);
	}, 0);
};

export const min = <T>(data: T[], columnId: keyof T) => {
	let min: number | undefined;

	data.forEach((row) => {
		const value = Number(row[columnId]);

		if (value != null && (min! > value || (min === undefined && value >= value))) {
			min = value;
		}
	});

	return min;
};

export const max = <T>(data: T[], columnId: keyof T) => {
	let max: number | undefined;

	data.forEach((row) => {
		const value = Number(row[columnId]);
		if (value != null && (max! < value || (max === undefined && value >= value))) {
			max = value;
		}
	});

	return max;
};

export const uniqueCount = <T>(data: T[], columnId: keyof T) => {
	return new Set(data.map((d) => d[columnId])).size;
};
