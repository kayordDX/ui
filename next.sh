#!/usr/bin/env bash

getPackageVersion() {
    echo $(pnpm view $1@next version)
}

getMyVersion() {
    cat package.json | jq '.dependencies."'$1'"' | sed 's/"//g'
}

GREEN=$'\e[0;32m'
RED=$'\e[0;31m'
NC=$'\e[0m'

for Item in bits-ui formsnap paneforge vaul-svelte;
  do
    echo "${GREEN}${NC} "$Item

    packageVersion=$(getPackageVersion $Item)
    myVersion=$(getMyVersion $Item)

    if [ $packageVersion != $myVersion ]; then
        echo $RED  Versions did not match for $Item ${NC}
        echo $packageVersion vs $myVersion
        exit 1
    fi
  done

echo "${GREEN} all good! ${NC}"
exit 0