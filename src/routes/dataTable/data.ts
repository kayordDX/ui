interface DataType {
	id: number;
	name: string;
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
		});
	}
	return data;
};