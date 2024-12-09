FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY cs-1660-project .
RUN npm install
WORKDIR /usr/src/app/server
EXPOSE 8080
ENTRYPOINT ["node", "./server.js"]