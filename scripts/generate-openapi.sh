#!/bin/sh
set -ux
SCRIPT_DIR="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit
  pwd -P
)"
PROJECT_ROOT="${SCRIPT_DIR}"/..
SWAGGER_SPEC_FILE="${PROJECT_ROOT}/transcendence-app/swagger-spec.yaml"
mkdir -p "${PROJECT_ROOT}"/webapp/src/shared/generated
ME="$(whoami)"
DOCKER_COMPOSE="$("${PROJECT_ROOT}"/scripts/get-docker-compose.sh)"
cd "${PROJECT_ROOT}" && touch "${SWAGGER_SPEC_FILE}"
{ { cd "${SCRIPT_DIR}" || exit ; } &&
${DOCKER_COMPOSE} run --rm swagger ; } ||
  rm "${SWAGGER_SPEC_FILE}"
docker run --rm -e MY_USER="${ME}" \
  -v ${PROJECT_ROOT}:/local openapitools/openapi-generator-cli:v6.2.0 /local/scripts/generate-cmd.sh
