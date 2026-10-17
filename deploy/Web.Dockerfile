FROM node:22-bookworm-slim AS build
WORKDIR /client
COPY package*.json ./
RUN npm ci
COPY . ./
RUN node scripts/import-assets.cjs resources/yukon-assets \
    && npm run build \
    && node scripts/assemble-local.cjs

FROM nginx:1.28-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY deploy/proxy_params_local /etc/nginx/proxy_params_local
COPY --from=build /client/local-dist/ /usr/share/nginx/html/
