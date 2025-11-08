# Neural Dawn Specification

## Overview

Neural Dawn establishes the monolithic commerce backbone with Express, TypeORM, and Next.js. It delivers CRUD functionality for products, orders, and users, along with a minimal storefront experience.

## Scope

- Backend API exposing `/api/v1/products`, `/api/v1/orders`, `/api/v1/users`.
- TypeORM entities for `User`, `Category`, `Product`, `Order`, and `OrderItem`.
- Seed script creating deterministic demo data (minimum 20 products).
- Next.js 14 frontend with product listing, details, and checkout flow.
- Docker Compose stack for backend, frontend, and PostgreSQL services.
- Initial documentation including changelog and environment configuration.

## Constraints

- Must run locally with `docker-compose up` without external dependencies.
- Use TypeScript end-to-end with strict typing.
- Implement REST routes under `/api/v1`.
- Provide deterministic seed data to simplify testing/demo.

## Non-Goals

- Deploying separate microservices.
- Integrating external payment or auth providers.
- Implementing AI or caching layers (deferred to later versions).

## Acceptance Criteria

1. `docker-compose up --build` starts backend, frontend, and PostgreSQL.
2. CRUD operations succeed via Postman/newman smoke tests.
3. Seed script runs automatically (or via documented command) to populate baseline catalog data.
4. Frontend displays seeded products and supports a simple checkout flow.
5. Documentation updated with environment variables, endpoints, and demo instructions.
