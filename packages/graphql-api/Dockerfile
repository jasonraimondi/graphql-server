FROM node:12-alpine
WORKDIR /app
COPY package* /app/
RUN npm install
COPY ormconfig.json tsconfig.json /app/
COPY src /app/src/
CMD ["npm", "run", "start"]
