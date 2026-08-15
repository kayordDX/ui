#!/usr/bin/env bash
set -euo pipefail

GREEN=$'\e[0;32m'
RED=$'\e[0;31m'
NC=$'\e[0m'

get_package_version() {
	pnpm view "$1@next" version
}

get_my_version() {
	node -e "
		const pkg = require('./package.json');
		const version = pkg.dependencies?.['$1'] ?? pkg.devDependencies?.['$1'];
		if (!version) process.exit(1);
		process.stdout.write(version.replace(/^[~^]/, ''));
	"
}

for item in layerchart vaul-svelte; do
	echo "${GREEN}${NC} $item"

	package_version="$(get_package_version "$item")"
	my_version="$(get_my_version "$item")"

	if [ "$package_version" != "$my_version" ]; then
		echo "${RED}  Versions did not match for $item${NC}"
		echo "  $package_version vs $my_version"
		exit 1
	fi
done

echo "${GREEN} all good!${NC}"
