#!/bin/sh
if docker container ls | grep "ft.transcendence.transcendence.app" > /dev/null 2>&1 ; then
   true
else
  { cd .. || exit ; } && find ./transcendence-app -type f -name "*.ts" \
  | grep -v "node_module\|dist\|test" \
  | grep -i "controller\|dto\|domain\|entity"
fi
