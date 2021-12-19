# Base
FROM node:16-alpine AS base
RUN apk update && apk add yarn

# deps
FROM base AS deps

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .prettierrc .prettierrc
COPY tsconfig.json tsconfig.json

RUN yarn install

# build
FROM deps AS build

WORKDIR /app

COPY public public
COPY src src

RUN yarn build

# deploy
FROM nginx:stable-alpine AS deploy

WORKDIR /app

RUN rm -f /etc/nginx/nginx.conf

COPY --from=build /app/build /app
COPY nginx.conf /etc/nginx/nginx.conf
