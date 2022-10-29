#!/bin/sh
set x
. get-paths.sh
if docker container ls | grep "ft.transcendence.transcendence.app" > /dev/null 2>&1 ; then
   true
else
  find "${PROJECT_ROOT}"/transcendence-app -type f -name "*.ts" \
  | grep -v "node_module\|dist\|test" \
  | grep -i "controller\|dto\|domain\|entity"
fi
