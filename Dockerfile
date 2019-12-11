FROM node:12-alpine as base
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY packages/graphql-api/package* /app/packages/graphql-api/
RUN npm ci --prefix packages/graphql-api
COPY packages/web/package* /app/packages/web/
RUN npm ci --prefix packages/web

FROM node:12-alpine as web
COPY --from=base /app /app
COPY cypress /app/cypress/
