$ErrorActionPreference = "Stop"

$rootDir = Split-Path -Parent (Resolve-Path "$PSScriptRoot/..")
$composeFile = Join-Path $rootDir "v5_singularity\docker-compose.singularity.yml"

Write-Host "==> Installing dependencies with pnpm"
Set-Location $rootDir
pnpm install

Write-Host "==> Building backend and frontend"
pnpm --filter @neuralcart/v5-backend build
pnpm --filter @neuralcart/v5-frontend build

Write-Host "==> Running migrations"
pnpm --filter @neuralcart/v5-backend migration:run

Write-Host "==> Seeding database"
pnpm --filter @neuralcart/v5-backend seed

Write-Host "==> Starting Singularity stack"
docker compose -f $composeFile up --build

