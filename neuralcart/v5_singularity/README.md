# Singularity (v5)

Finalize the self-hosted stack with production-grade Docker orchestration, CI/CD, and observability.

## Scope
- Compose full services suite (backend, frontend, redis, elasticsearch, ollama, worker, prom/grafana).
- Automate builds/tests via GitHub Actions and container publishing.
- Expose metrics, dashboards, and a `quick-start.sh` for local bootstrapping.

## Next Steps
Implementation plan is captured in `docs/spec_singularity.md`.

### Key Endpoints
- `GET /api/v1/search?q=term` – full-text search powered by Elasticsearch.
- `GET /api/v1/recommendations?productId=<uuid>` – pgvector + Ollama embeddings for product similarity.
- `GET /api/v1/metrics` – Prometheus metrics feed.

## Frontend Highlights

- Next.js 14 App Router with server components pulling live metrics from the Singularity backend.
- Enterprise navigation with persistent cart state, responsive search, and recommendation-driven product detail pages.
- Observability workspace summarising dependency health, aligned with backend Prometheus/Grafana setup.
- Checkout and cart flows wired via Zustand state, ready to integrate with external payment providers.

## Quick Start

```bash
# from repository root
./v5_singularity/quick-start.sh
```

PowerShell:

```powershell
.\v5_singularity\quick-start.ps1
```

Prometheus: `http://localhost:9090`
Grafana: `http://localhost:3001` (credentials `admin/admin`).
