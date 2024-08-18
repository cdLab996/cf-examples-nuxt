#!/usr/bin/env bash

DIRS_TO_DELETE=(
  ".nuxt"
  ".wrangler"
  "dist"
  "node_modules"
)

echo "Start cleaning up directories: ${DIRS_TO_DELETE[*]}"

for dir in "${DIRS_TO_DELETE[@]}"
do
  rm -rf $dir && echo "Removed $dir directory."
done

echo "Cleanup completed successfully!"