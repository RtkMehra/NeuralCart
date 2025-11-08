# Memory Surge (v2)

Introduce Redis-backed caching to accelerate catalog endpoints and expose cache hit diagnostics.

## Scope
- Provision Redis service and shared cache client wrapper.
- Cache product list/detail with invalidation on mutations.
- Return X-Cache diagnostics headers and TTL-driven freshness.

## Next Steps
See docs/spec_memory_surge.md for detailed tasks and acceptance criteria.
