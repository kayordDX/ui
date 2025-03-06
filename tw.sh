#!/usr/bin/env bash

GREEN=$'\e[0;32m'
RED=$'\e[0;31m'
NC=$'\e[0m'

process_directory() {
  local dir="$1"

  if [[ ! -d "$dir" ]]; then
    echo "Error: Directory '$dir' not found."
    return 1
  fi

  find "$dir" -name "*.svelte" -print0 | while IFS= read -r -d $'\0' item; do
    sed -i -E 's/\[--([^]]*)\]/\(--\1\)/g; s/outline-none/outline-hidden/g; s/\[var\(([^)]*)\)\]/(\1)/g;' $item
    echo "${GREEN}${NC} "$item
  done

  find "$dir" -mindepth 1 -type d -print0 | while IFS= read -r -d $'\0' subdir; do
    process_directory "$subdir"
  done
}

process_directory "./src/lib/components/ui/"
echo "${GREEN} Tailwind 4 updated all! ${NC}"
exit 0
