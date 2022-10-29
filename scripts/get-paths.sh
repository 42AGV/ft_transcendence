#!/bin/false
SCRIPT_DIR="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit
  pwd -P
)"

PROJECT_ROOT="$(
{ cd -- "${SCRIPT_DIR}" >/dev/null 2>&1 && cd .. ; } || exit
  pwd -P
)"
