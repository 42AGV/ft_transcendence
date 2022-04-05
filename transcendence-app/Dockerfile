FROM node:16.14.2-alpine3.15 AS development
WORKDIR  /transcendence-app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build
CMD ["npm", "run", "start:dev"]

FROM node:16.14.2-alpine3.15 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR  /transcendence-app
COPY package*.json ./
RUN npm install --production
COPY . ./
COPY --from=development /transcendence-app/dist ./dist
CMD ["node", "dist/main"]
