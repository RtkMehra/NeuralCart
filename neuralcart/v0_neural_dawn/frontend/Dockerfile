FROM node:20-alpine AS base

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY v0_neural_dawn/backend/package.json v0_neural_dawn/backend/package.json
COPY v0_neural_dawn/frontend/package.json v0_neural_dawn/frontend/package.json

RUN pnpm install --filter @neuralcart/v0-frontend... --prefer-offline --frozen-lockfile=false

COPY v0_neural_dawn/frontend v0_neural_dawn/frontend

RUN pnpm --filter @neuralcart/v0-frontend build

EXPOSE 3000

CMD ["pnpm", "--filter", "@neuralcart/v0-frontend", "start"]

