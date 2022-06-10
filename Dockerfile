FROM node:18-alpine as build

ENV PORT=4050
WORKDIR /app
COPY . /app/
RUN npm install && npm run build:ssr

FROM alpine:latest

LABEL AUTHOR="Jan Kuri" AUTHOR_EMAIL="jkuri88@gmail.com"

ENV PORT=4444
WORKDIR /app

COPY --from=build /usr/local/bin/node /usr/bin
COPY --from=build /usr/lib/libgcc* /usr/lib/libstdc* /usr/lib/
COPY --from=build /app/dist ./dist
COPY --from=build /app/data ./data

EXPOSE 4444

CMD ["node", "/app/dist/server/main.js"]
