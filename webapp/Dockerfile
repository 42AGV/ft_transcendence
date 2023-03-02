ARG NODE_VERSION=18.14.2
ARG ALPINE_VERSION=3.17
ARG NGINX_VERSION=1.22.1

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS development
WORKDIR /service
ENV NODE_ENV=development
RUN apk add --no-cache dumb-init
COPY ["package.json", "package-lock.json", "./"]
COPY ["packages", "packages"]
COPY ["webapp", "webapp"]
RUN npm clean-install && npm run build-packages
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "start-webapp"]

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
WORKDIR /service
ENV NODE_ENV=production
ARG REACT_APP_NAME
ENV REACT_APP_NAME=${REACT_APP_NAME}
COPY ["package.json", "package-lock.json", "./"]
COPY ["packages", "packages"]
COPY ["webapp", "webapp"]
RUN npm clean-install --omit=dev && npm run build-packages
RUN npm run build -w webapp

FROM nginx:${NGINX_VERSION}-alpine AS production
COPY --from=builder --chown=nginx:nginx /service/webapp/build /usr/share/nginx/html
