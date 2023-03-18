#!/bin/sh
set x
SCRIPT_DIR="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit
  pwd -P
)"

PROJECT_ROOT="$(
{ cd -- "${SCRIPT_DIR}" >/dev/null 2>&1 && cd .. >/dev/null 2>&1 ; } || exit
  pwd -P
)"
find "${PROJECT_ROOT}"/transcendence-app/src -type f -name "*.ts" \
| grep -v "spec.ts" \
| grep -i "controller.ts\|dto.ts\|entity.ts"
