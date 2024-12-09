FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY ./cs-1660-project/package.json .
COPY ./cs-1660-project/package-lock.json .

RUN npm install -g @angular/cli
RUN npm install

COPY ./cs-1660-project .

RUN ng build --configuration production

WORKDIR /usr/src/app/server

EXPOSE 8080

ENTRYPOINT ["node", "server.js"]