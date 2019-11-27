FROM node:12-alpine
ENV NODE_ENV=production \
    ADBLOCK=true
WORKDIR /app
COPY package* /app/
RUN npm ci --production=false
COPY src /app/src/
CMD ["npm", "run", "start"]
