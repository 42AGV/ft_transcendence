#!/bin/sh
set -eux
docker-entrypoint.sh generate -i /local/transcendence-app/swagger-spec.yaml \
  -g typescript-fetch \
  -o /local/webapp/src/shared/generated
useradd -U -ms /bin/bash "${MY_USER}"
chown -R "${MY_USER}":"${MY_USER}" /local/webapp/src/shared/generated
