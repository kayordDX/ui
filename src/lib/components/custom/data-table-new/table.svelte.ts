interface TableStoreProps {
	isFullscreen: boolean;
}

export let tableStore: TableStoreProps = $state({
	isFullscreen: false,
});
