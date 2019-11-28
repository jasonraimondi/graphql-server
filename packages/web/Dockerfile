FROM node:12-alpine as builder
ENV NODE_ENV=production \
    CI=true \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
COPY package* /app/
RUN npm ci --production=false
COPY codegen.yml .schema.graphql .graphqlconfig /app/
COPY next* /app/
COPY tsconfig* /app/
COPY public /app/public/
COPY graphql /app/graphql/
COPY styles /app/styles/
COPY src /app/src/
RUN npm run gen
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV=production \
    CI=true \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app
RUN mkdir -p /app && chown node:node /app
USER node
COPY --from=builder --chown=node:node /app/next.config.js /app/package.json /app/package-lock.json /app/
RUN npm ci
COPY --from=builder --chown=node:node /app/dist/ /app/dist/
CMD ["npm", "run", "start"]
