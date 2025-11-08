FROM node:20-alpine AS deps

WORKDIR /workspace

RUN npm install -g pnpm@8.15.0

COPY package.json pnpm-workspace.yaml ./
COPY v5_singularity/frontend/package.json v5_singularity/frontend/package.json

RUN pnpm install --filter @neuralcart/v5-frontend... --prefer-offline --frozen-lockfile=false

COPY v5_singularity/frontend v5_singularity/frontend

RUN pnpm --filter @neuralcart/v5-frontend build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm@8.15.0

COPY --from=deps /workspace /app

ENV PORT=3000
EXPOSE 3000

CMD ["pnpm", "--filter", "@neuralcart/v5-frontend", "start"]

