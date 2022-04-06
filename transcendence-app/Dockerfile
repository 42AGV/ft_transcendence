ARG NODE_VERSION=16.14.2
ARG ALPINE_VERSION=3.15

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS development
ENV NODE_ENV=development
RUN apk add --no-cache dumb-init
WORKDIR  /transcendence-app
COPY ["package.json", "package-lock.json", "./"]
RUN npm clean-install
COPY . .
RUN npm run build
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start:dev"]

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS production
ENV NODE_ENV=production
RUN apk add --no-cache dumb-init
WORKDIR  /transcendence-app
COPY ["package.json", "package-lock.json", "./"]
RUN npm clean-install --production
COPY --from=development --chown=node:node /transcendence-app/dist ./dist
USER node
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/main"]
