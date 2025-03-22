#!/usr/bin/env bash

echo "run post install script"

echo "compile typescript"
./node_modules/.bin/tsc || exit 1
npm run data-services || exit 1
echo "compile typescript >> DONE"

echo "run post install script >> DONE"

echo "apply aliases"

# Check if the current directory is a Git repository
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git config alias.s status
    git config alias.p "push origin HEAD"
    git config alias.a "add ."
    git config alias.rh "reset --hard"
    git config alias.c "!./node_modules/.bin/ts-node ./ts-scripts/commit.ts"
    git config alias.pu "!./node_modules/.bin/ts-node ./ts-scripts/pull.ts"
    echo "apply aliases >> DONE"
else
    echo "Not in a Git repository, skipping Git alias setup."
fi

exit 0
