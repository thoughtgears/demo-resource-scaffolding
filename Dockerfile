FROM node:20-slim AS build

ARG NODE_ENV=production

RUN apt-get update && \
    apt-get install -y python3 g++ make && \
    ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app
COPY package*.json .
RUN npm install

FROM node:14-alpine

WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY index.js .
COPY firestore.js .

EXPOSE 8080

CMD ["node", "index.js"]
