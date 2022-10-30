#!/bin/sh
set -eu
if which 'docker-compose' > /dev/null 2>&1; then
  echo "docker-compose"
else
  echo "docker compose"
fi
