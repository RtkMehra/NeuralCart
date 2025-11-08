FROM node:20-alpine AS base

WORKDIR /workspace

RUN npm install -g pnpm@8.15.0

COPY package.json pnpm-workspace.yaml ./
COPY v5_singularity/backend v5_singularity/backend

RUN pnpm install --filter @neuralcart/v5-backend... --prefer-offline --frozen-lockfile=false && \
    pnpm --filter @neuralcart/v5-backend build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm@8.15.0

COPY --from=base /workspace /app

EXPOSE 4000

CMD ["pnpm", "--filter", "@neuralcart/v5-backend", "start"]

