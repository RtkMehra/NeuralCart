# Echo Search Specification

## Overview

Enable Elasticsearch-backed search to provide full-text discovery across the product catalog.

## Scope

- Provision Elasticsearch container (and optional Kibana) in compose with persistent volumes.
- Define index mappings/analysis pipeline for product documents.
- Publish product events (create/update/delete) to the search index; include backfill/reindex script.
- Implement /search?q= endpoint with ranking metadata and pagination.
- Extend Next.js frontend with search bar and results page leveraging the new endpoint.

## Constraints

- Index mutations must be resilient to Elasticsearch downtime (queue/retry or graceful degradation).
- Search results should include highlights or snippets (optional stretch) with consistent sorting.
- Reindex script must be idempotent and documented for ops usage.

## Acceptance Criteria

1. Running compose brings up Elasticsearch and required dependencies.
2. Creating or updating a product within the backend reflects in Elasticsearch within seconds.
3. /search?q=term returns relevant matches ordered by score, including pagination metadata.
4. Manual reindex command repopulates the index from the relational database without duplicates.
5. Frontend search UI surfaces results and handles empty state or error messaging gracefully.
