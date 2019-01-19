FROM node:11-alpine as ui

COPY . /app

WORKDIR /app

RUN npm install && npm run build:ssr

ENTRYPOINT [ "npm", "run", "serve:ssr" ]

EXPOSE 4444
