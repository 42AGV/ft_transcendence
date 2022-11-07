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
if docker container ls | grep "ft.transcendence.transcendence.app" > /dev/null 2>&1 ; then
   true
else
  find "${PROJECT_ROOT}"/transcendence-app/src -type f -name "*.ts" \
  | grep -v "spec" \
  | grep -i "controller\|dto\|entity"
fi
