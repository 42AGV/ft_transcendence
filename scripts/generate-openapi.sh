#!/bin/sh
set -eux
PROJECT_ROOT="$( cd -- "$(dirname "$0")"/.. >/dev/null 2>&1 ; pwd -P )"
mkdir -p "${PROJECT_ROOT}"/webapp/src/shared/generated
which 'docker-compose'
NO_HYPHEN=$?
DOCKER_COMPOSE="$(
if [ ${NO_HYPHEN} -ne '0' ]; then
   echo "docker compose"
 else
   echo "docker-compose"
fi )"
cd "${PROJECT_ROOT}" && touch transcendence-app/swagger-spec.yaml
${DOCKER_COMPOSE} run --rm -t swagger
docker run --rm \
  -v ${PROJECT_ROOT}:/local openapitools/openapi-generator-cli:v6.2.0 generate \
  -i /local/transcendence-app/swagger-spec.yaml \
  -g typescript-fetch \
  -o /local/webapp/src/shared/generated
