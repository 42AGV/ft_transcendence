 docker run --rm \
  -v ${PWD}:/local openapitools/openapi-generator-cli generate \
  -i /local/transcendence-app/swagger-spec.json \
  -g typescript-fetch \
  -o /local/webapp/src/shared/generated
