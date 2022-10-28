#!/bin/sh
set -ux
docker-entrypoint.sh generate -i /local/transcendence-app/swagger-spec.yaml \
  -g typescript-fetch \
  -o /local/webapp/src/shared/generated || exit
useradd -U -ms /bin/sh "${MY_USER}"
chown -R "${MY_USER}":"${MY_USER}" /local/webapp/src/shared/generated
