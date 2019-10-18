FROM node:12-alpine as builder
ENV NODE_ENV=production
WORKDIR /app
COPY nextjs/package* /app/
RUN npm install
COPY nextjs/next-env.d.ts nextjs/next.config.js nextjs/tsconfig.json /app/
COPY tsconfig.json /
COPY nextjs/src /app/src/
COPY nextjs/generated /app/generated/
RUN npm run build

FROM node:12-alpine
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir -p /app && chown node:node /app
USER node
COPY --from=builder --chown=node:node /app/next.config.js /app/package.json /app/package-lock.json /app/
RUN npm install --production
COPY --from=builder --chown=node:node /app/dist/ /app/dist/
CMD ["npm", "run", "start"]