FROM node:12-alpine as builder
ENV NODE_ENV=production \
    CI=true
WORKDIR /app/packages/api
COPY package* /app/packages/api/
RUN npm ci --production=false
COPY tsconfig* /app/packages/api/
COPY src /app/packages/api/src/
RUN npm run build
RUN npm prune

FROM node:12-alpine
ENV NODE_ENV=production \
    TYPEORM_ENTITIES="src/entity/**/*_entity.js"
WORKDIR /app/packages/api
RUN mkdir -p /app/packages/api && chown node:node /app/packages/api
USER node
COPY --from=builder --chown=node:node /app/packages/api/package* /app/packages/api/
COPY --from=builder --chown=node:node /app/packages/api/tsconfig.json /app/packages/api/tsconfig.json
COPY --from=builder --chown=node:node /app/packages/api/dist /app/packages/api/src
COPY --from=builder --chown=node:node /app/packages/api/node_modules /app/packages/api/node_modules
CMD ["node", "/app/packages/api/src/server.js"]
