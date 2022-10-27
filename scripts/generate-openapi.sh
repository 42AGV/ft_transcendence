#!/usr/bin/env bash
set -euxo pipefail

SCRIPTPATH="$( cd -- "$(dirname "$0/..")" >/dev/null 2>&1 ; pwd -P )"

mkdir -p ${SCRIPTPATH}/webapp/src/shared/generated
docker run --rm \
  -v ${SCRIPTPATH}:/local openapitools/openapi-generator-cli generate \
  -i /local/transcendence-app/swagger-spec.yaml \
  -g typescript-fetch \
  -o /local/webapp/src/shared/generated
