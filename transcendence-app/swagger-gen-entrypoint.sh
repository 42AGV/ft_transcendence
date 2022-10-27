#!/bin/sh
set x
npm install --location=global @nestjs/cli
export FORTYTWO_APP_ID=42-intra-app-id
export FORTYTWO_APP_SECRET=42-intra-app-secret
export FORTYTWO_APP_CALLBACK_URL=http://localhost:3000/api/v1/auth/login
export FORTYTWO_APP_AUTHORIZATION_URL=https://api.intra.42.fr/oauth/authorize
export FORTYTWO_APP_TOKEN_URL=https://api.intra.42.fr/oauth/token
export FORTYTWO_APP_PROFILE_URL=https://api.intra.42.fr/v2/me
export NODE_ENV=test
export MEMCACHED_HOST=localhost
export MEMCACHED_PORT=11212
export TRANSCENDENCE_APP_DATA=/tmp
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5433
export POSTGRES_DB=ft_transcendence
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
export SESSION_SECRET=80fbbf31-7083-419a-8fe1-23f1e10aae80
export MEMCACHED_SECRET=c9caf57b-6a21-415f-946e-b96c6b372fe5
cd /home && npm clean-install && nest start -c swagger.nest-cli.json && cat swagger-spec.yaml
