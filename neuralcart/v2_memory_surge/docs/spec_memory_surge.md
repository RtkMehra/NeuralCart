# Memory Surge Specification

## Overview

Introduce Redis caching as a short-term memory layer to accelerate hot catalog endpoints and expose cache diagnostics.

## Scope

- Add Redis service to compose stack and supply connection configuration via .env.
- Implement cache wrapper (cache.service.ts) using ioredis or equivalent with typed helpers.
- Cache GET /products and GET /products/:id responses with 300-second TTL.
- Invalidate cache on product mutations (create/update/delete).
- Return X-Cache: HIT|MISS header to aid debugging.
- Update frontend to surface faster loads or header diagnostics (optional badge).

## Constraints

- Cache must gracefully degrade when Redis is unavailable (fallback to direct DB queries).
- TTL is fixed at 300 seconds; respect invalidations on data changes.
- No stale mutation resultsâ€”mutations must purge relevant keys prior to responding.

## Acceptance Criteria

1. Redis container starts alongside backend and is reachable using env config.
2. First request to /api/v1/products yields X-Cache: MISS; subsequent request within TTL yields HIT.
3. Updating or deleting a product invalidates the relevant cache entries so the next fetch is fresh.
4. Cache wrapper emits structured logs on failures and continues serving from DB.
5. Documentation updated with testing commands and troubleshooting steps (curl -I).
