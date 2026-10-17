FROM node:22-bookworm-slim
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
COPY deploy/runtime/ ./local/
RUN node local/install-pizzatron.cjs && npm run build
ENTRYPOINT ["node", "local/start.cjs"]
