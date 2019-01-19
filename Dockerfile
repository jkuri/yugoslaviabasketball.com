FROM node:11-alpine as ui

COPY . /app

WORKDIR /app

RUN npm install yarn -g && yarn && yarn build:ssr

ENTRYPOINT [ "yarn", "serve:ssr" ]

EXPOSE 4444
