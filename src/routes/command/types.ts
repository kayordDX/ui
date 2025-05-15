interface DataItem {
	id: number;
	name: string;
	parentId: number | null;
}

interface TreeNode extends DataItem {
	children?: TreeNode[];
}
