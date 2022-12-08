ARG NODE_VERSION=18.12.1
ARG ALPINE_VERSION=3.16
ARG NGINX_VERSION=1.22.1

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS development
ENV NODE_ENV=development
RUN apk add --no-cache dumb-init
WORKDIR /webapp
COPY ["package.json", "package-lock.json", "./"]
RUN npm clean-install
COPY . .
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
ENV NODE_ENV=production
ARG REACT_APP_NAME
ENV REACT_APP_NAME=${REACT_APP_NAME}
WORKDIR /webapp
COPY ["package.json", "package-lock.json", "./"]
RUN npm clean-install --omit=dev
COPY . .
RUN npm run build

FROM nginx:${NGINX_VERSION}-alpine AS production
COPY --from=builder --chown=nginx:nginx /webapp/build /usr/share/nginx/html
