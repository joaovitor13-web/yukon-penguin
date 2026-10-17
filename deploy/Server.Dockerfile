FROM node:22-bookworm-slim
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server/ ./
RUN npm run build
COPY deploy/runtime/ ./local/
ENTRYPOINT ["node", "local/start.cjs"]
