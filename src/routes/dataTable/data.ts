interface DataType {
	id: number;
	name: string;
	day: string;
}

export const getData = () => {
	const data: DataType[] = [];
	for (let i = 0; i < 50; i++) {
		data.push({
			id: i + 1,
			name: Array(Math.floor(Math.random() * 10) + 5)
				.fill("")
				.map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
				.join(""),
			day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(Math.random() * 7)],
		});
	}
	return data;
};
