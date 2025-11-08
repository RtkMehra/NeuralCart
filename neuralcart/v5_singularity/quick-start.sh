#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
COMPOSE_FILE="${ROOT_DIR}/v5_singularity/docker-compose.singularity.yml"

echo "==> Installing dependencies with pnpm"
cd "${ROOT_DIR}"
pnpm install

echo "==> Building backend and frontend"
pnpm --filter @neuralcart/v5-backend build
pnpm --filter @neuralcart/v5-frontend build

echo "==> Running migrations"
pnpm --filter @neuralcart/v5-backend migration:run

echo "==> Seeding database"
pnpm --filter @neuralcart/v5-backend seed

echo "==> Starting Singularity stack"
docker compose -f "${COMPOSE_FILE}" up --build

