#!/bin/sh
set -eu
which 'docker-compose' > /dev/null 2>&1
NO_HYPHEN=$?
if [ ${NO_HYPHEN} -ne '0' ]; then
   echo "docker compose"
 else
   echo "docker-compose"
fi
