
FROM node:lts AS development

WORKDIR /app

COPY package*.json .

RUN yarn install

COPY . .

FROM development AS build

RUN yarn build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/docker/config/default.conf /etc/nginx/conf.d/default.conf

RUN rm -rf ./*

COPY --from=build /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
