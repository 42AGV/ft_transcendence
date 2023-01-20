ARG NODE_VERSION=18.12.1
ARG ALPINE_VERSION=3.16
ARG TRANSCENDENCE_APP_DATA=/var/lib/transcendence-app

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS development
ARG TRANSCENDENCE_APP_DATA
ENV TRANSCENDENCE_APP_DATA=${TRANSCENDENCE_APP_DATA}
ENV NODE_ENV=development
RUN apk add --no-cache dumb-init \
  && mkdir -p ${TRANSCENDENCE_APP_DATA} \
  && chown -R node:node ${TRANSCENDENCE_APP_DATA}
WORKDIR  /service
COPY ["package.json", "package-lock.json", "."]
COPY ["packages/pong-engine", "packages/pong-engine"]
COPY ["transcendence-app", "transcendence-app"]
RUN npm clean-install
RUN npm run build -w transcendence-app
VOLUME ${TRANSCENDENCE_APP_DATA}
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start-app-dev"]

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS production
ARG TRANSCENDENCE_APP_DATA
ENV TRANSCENDENCE_APP_DATA=${TRANSCENDENCE_APP_DATA}
ENV NODE_ENV=production
RUN apk add --no-cache dumb-init \
  && mkdir -p ${TRANSCENDENCE_APP_DATA} \
  && chown -R node:node ${TRANSCENDENCE_APP_DATA}
WORKDIR  /service
COPY ["package.json", "package-lock.json", "."]
RUN npm clean-install --omit=dev
COPY --from=development --chown=node:node /service/transcendence-app/dist ./dist
USER node
VOLUME ${TRANSCENDENCE_APP_DATA}
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/src/main"]

FROM development AS swagger
ENTRYPOINT ["npm", "run", "build-swagger-api"]
