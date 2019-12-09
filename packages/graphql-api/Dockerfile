FROM node:12-alpine as builder
ENV NODE_ENV=production \
    CI=true
WORKDIR /app/packages/graphql-api
COPY package* /app/packages/graphql-api/
RUN npm ci --production=false
COPY tsconfig* /app/packages/graphql-api/
COPY src /app/packages/graphql-api/src/
RUN npm run build
RUN npm prune

FROM node:12-alpine
ENV NODE_ENV=production \
    TYPEORM_ENTITIES="src/entity/**/*_entity.js"
WORKDIR /app/packages/graphql-api
RUN mkdir -p /app/packages/graphql-api && chown node:node /app/packages/graphql-api
USER node
COPY --from=builder --chown=node:node /app/packages/graphql-api/package* /app/packages/graphql-api/
COPY --from=builder --chown=node:node /app/packages/graphql-api/tsconfig.json /app/packages/graphql-api/tsconfig.json
COPY --from=builder --chown=node:node /app/packages/graphql-api/dist /app/packages/graphql-api/src
COPY --from=builder --chown=node:node /app/packages/graphql-api/node_modules /app/packages/graphql-api/node_modules
CMD ["node", "/app/packages/graphql-api/src/server.js"]
