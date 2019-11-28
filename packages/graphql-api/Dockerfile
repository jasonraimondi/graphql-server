FROM node:12-alpine as builder
ENV NODE_ENV=production \
    CI=true
WORKDIR /app
COPY package* /app/
RUN npm ci --production=false
COPY tsconfig* /app/
COPY src /app/src/
RUN npm run build
RUN npm prune

FROM node:12-alpine
ENV NODE_ENV=production \
    TYPEORM_ENTITIES="dist/entity/**/*_entity.js"
WORKDIR /app
RUN mkdir -p /app && chown node:node /app
USER node
COPY --from=builder --chown=node:node /app/package* /app/
COPY --from=builder --chown=node:node /app/dist /app/dist
COPY --from=builder --chown=node:node /app/node_modules /app/node_modules
CMD ["npm", "run", "start"]
