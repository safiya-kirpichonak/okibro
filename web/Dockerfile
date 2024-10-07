FROM node:latest as build

WORKDIR /app

COPY web/package*.json ./

RUN npm install

COPY web/ .

RUN npm run build

FROM nginx:latest

EXPOSE 3000

COPY web/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./app/build /usr/share/nginx/html
