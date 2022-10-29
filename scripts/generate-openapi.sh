#!/bin/sh

set -x

SCRIPT_DIR="$(
  cd -- "$(dirname "$0")" >/dev/null 2>&1 || exit
  pwd -P
)"

PROJECT_ROOT="${SCRIPT_DIR}"/..
SWAGGER_SPEC_FILE="${PROJECT_ROOT}/transcendence-app/swagger-spec.yaml"
DOCKER_COMPOSE="$("${PROJECT_ROOT}"/scripts/get-docker-compose.sh)"
NO_SPEC="false"
NO_GEN="false"

until [ -z "$1" ]
do
	if [ "$1" = "--no-spec" ] || [ "$1" = "-ns" ]; then
		NO_SPEC="true"
	fi
	if [ "$1" = "--no-gen" ] || [ "$1" = "-ng" ]; then
  	NO_GEN="true"
  fi
	if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  	echo "generate_openapi_script.sh:"
  	echo "usage: ./generate_openapi_script.sh [options]"
  	echo "  -h --help       print this usage and exit"
  	echo "  -ns --no-spec   run this script without creating swagger spec file"
  	echo "  -ng --no-gen    run this script without generating files"
  	exit 0
  fi
	shift
done

create_swagger_spec() {
  if [ "${NO_SPEC}" = "true" ]; then return 1
  fi
  cd "${PROJECT_ROOT}" && touch "${SWAGGER_SPEC_FILE}"
  { { cd "${SCRIPT_DIR}" || exit ; } && \
      { ${DOCKER_COMPOSE} run --rm swagger || { rm "${SWAGGER_SPEC_FILE}" && exit ; } ; } \
  && ${DOCKER_COMPOSE} down -v ; }
}

generate_files() {
  if [ "${NO_GEN}" = "true" ]; then return 1
  fi
  mkdir -p "${PROJECT_ROOT}"/webapp/src/shared/generated
  docker run --rm -e MY_USER="${USER}" \
    -v "${PROJECT_ROOT}":/local openapitools/openapi-generator-cli:v6.2.0 /local/scripts/generate-cmd.sh
}

create_swagger_spec
generate_files
