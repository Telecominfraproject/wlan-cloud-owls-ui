FROM node:18.7.0-alpine3.15 AS build
COPY package.json package-lock.json /
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.22.0-alpine AS runtime
COPY --from=build /build/ /usr/share/nginx/html/
COPY --from=build docker-entrypoint.d/40-generate-config.sh /docker-entrypoint.d/40-generate-config.sh
