FROM node:12-alpine
WORKDIR /app
COPY package.json package-lock.json lerna.json /app/
COPY cypress /app/cypress/
COPY packages /app/packages/
RUN npx lerna bootstrap
