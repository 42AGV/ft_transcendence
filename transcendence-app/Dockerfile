ARG NODE_VERSION=16.14.2
ARG ALPINE_VERSION=3.15

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS development
WORKDIR  /transcendence-app
COPY ["package.json", "package-lock.json", "./"]
RUN npm clean-install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:dev"]

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN apk add --no-cache dumb-init
WORKDIR  /transcendence-app
COPY ["package.json", "package-lock.json", "./"]
RUN npm clean-install --production
COPY --from=development --chown=node:node /transcendence-app/dist ./dist
USER node
CMD ["dumb-init", "node", "dist/main"]
