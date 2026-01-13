interface DataItem {
	id: number;
	name: string;
	parentId: number | null;
}

export interface TreeNode extends DataItem {
	children?: TreeNode[];
}
