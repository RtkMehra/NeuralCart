# Singularity Specification

## Overview

Finalize NeuralCart with production-quality Docker orchestration, CI/CD pipelines, and observability stack.

## Scope

- Compose the full service mesh: backend, frontend, redis, elasticsearch, ollama, worker, postgres, prometheus, grafana.
- Provide `quick-start.sh` or make targets to bootstrap the entire stack locally.
- Add GitHub Actions workflows for lint/test, build, and Docker image publishing.
- Expose backend metrics via `/metrics` endpoint (Prometheus format) and configure Prometheus scrape targets.
- Ship Grafana dashboards for request latency, cache hits, search/query performance, and worker metrics.
- Harden Dockerfiles (multi-stage builds, smaller runtime images) and document deployment considerations.

## Constraints

- CI must run deterministically without external secrets beyond documented placeholders.
- Monitoring stack should rely on local data sources (no SaaS dependencies).
- Scripts must support Windows and Unix environments where feasible (PowerShell/Bash).

## Acceptance Criteria

1. `./quick-start.sh` (or equivalent) brings up the entire stack with seeded data and monitoring accessible.
2. GitHub Actions workflow badges visible in README with passing status after pipelines succeed.
3. Prometheus scrapes backend metrics; Grafana dashboards display key charts with sample data.
4. Docker images build reproducibly with multi-stage configuration and minimal surface area.
5. Documentation includes deployment guide, troubleshooting tips, and monitoring playbook.
