ARG NODE_VERSION=16.16.0
ARG ALPINE_VERSION=3.16
ARG TRANSCENDENCE_APP_DATA=/var/lib/transcendence-app

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
ARG TRANSCENDENCE_APP_DATA
ENV TRANSCENDENCE_APP_DATA=${TRANSCENDENCE_APP_DATA}
RUN apk add --no-cache dumb-init \
  && mkdir -p ${TRANSCENDENCE_APP_DATA} \
  && chown -R node:node ${TRANSCENDENCE_APP_DATA}
COPY ["package.json", "package-lock.json", "/transcendence-app/"]

FROM base AS development
ENV NODE_ENV=development
WORKDIR  /transcendence-app
RUN npm clean-install
COPY . .
RUN npm run build
ARG TRANSCENDENCE_APP_DATA
ENV TRANSCENDENCE_APP_DATA=${TRANSCENDENCE_APP_DATA}
VOLUME ${TRANSCENDENCE_APP_DATA}
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start:dev"]

FROM base AS production
ENV NODE_ENV=production
WORKDIR  /transcendence-app
RUN npm clean-install --production
COPY --from=development --chown=node:node /transcendence-app/dist ./dist
USER node
ARG TRANSCENDENCE_APP_DATA
ENV TRANSCENDENCE_APP_DATA=${TRANSCENDENCE_APP_DATA}
VOLUME ${TRANSCENDENCE_APP_DATA}
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]
