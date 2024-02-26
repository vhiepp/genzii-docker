
FROM node:lts AS build-app

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build-app /app/docker/config/default.conf /etc/nginx/conf.d/default.conf

COPY --from=build-app /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
