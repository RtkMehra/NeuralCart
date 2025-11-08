# Divide & Conquer Specification

## Overview

Split database responsibilities into dedicated services and prove recovery stories via health checks and graceful lifecycle handling.

## Scope

- Provision standalone Postgres container plus companion tooling (pgAdmin, pooling notes).
- Externalize database connection config via .env and shared config utilities.
- Implement /health endpoint with DB ping and dependency status structure.
- Add graceful shutdown hooks responding to SIGTERM/SIGINT, ensuring DB connections close cleanly.
- Document PgBouncer and connection pooling guidance in README/docs.

## Constraints

- Must tolerate DB restarts without manual intervention.
- Health endpoint should return structured JSON with overall status and per-dependency data.
- Continue to use TypeORM migrations; no synchronize mode.

## Acceptance Criteria

1. docker-compose split includes app and db containers, with optional pgAdmin.
2. Backend /health returns { status: 'ok', db: 'connected' } (or similar) when healthy.
3. Restarting the DB container while the app is running results in successful reconnection and healthy status within seconds.
4. Graceful shutdown logs indicate connection cleanup and exit code 0.
5. Docs updated with operational notes and recovery procedure.
