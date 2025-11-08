# Neural Dawn (v0)

Neural Dawn is the foundation of NeuralCart: a monolithic commerce stack powered by Express, TypeORM, PostgreSQL, and a Next.js 14 storefront. Everything runs locally with pnpm and Docker Compose.

## Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

## Setup

```bash
# install workspace dependencies
pnpm install

# build backend
pnpm --filter @neuralcart/v0-backend build

# run database migrations
pnpm --filter @neuralcart/v0-backend migration:run

# seed deterministic data
pnpm --filter @neuralcart/v0-backend seed
```

## Development

Run the backend (port `4000`) and frontend (port `3000`) locally:

```bash
pnpm --filter @neuralcart/v0-backend dev
pnpm --filter @neuralcart/v0-frontend dev
```

The Next.js storefront consumes the REST API exposed under `/api/v1`.

## Docker Compose

Bring up the full stack with PostgreSQL, backend, and frontend:

```bash
cd v0_neural_dawn
docker compose up --build
```

To seed the database inside Docker:

```bash
docker compose --profile seed run --rm seed
```

## Key Endpoints

- `GET /api/v1/products` – paginated catalog
- `GET /api/v1/products/:id` – product detail
- `POST /api/v1/orders` – create order
- `GET /api/v1/users` – list customers

## Frontend Flow

1. Browse products on `/` and add to cart (Zustand-backed state).
2. Review the cart at `/cart`.
3. Checkout via `/checkout`, selecting a seeded customer. Orders are persisted via TypeORM.

## Seeded Credentials

- `demo@neuralcart.dev` / `demo123`
- `jane@neuralcart.dev` / `neural123`

Use these users when placing orders in the demo checkout.

