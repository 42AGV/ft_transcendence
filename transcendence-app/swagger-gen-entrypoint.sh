#!/bin/sh
set x
npm install --location=global @nestjs/cli
export NODE_ENV=test
cd /home && npm clean-install && nest start -c swagger.nest-cli.json && cat swagger-spec.yaml
