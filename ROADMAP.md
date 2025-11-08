# 🧠 NeuralCart — Self-Hosted Intelligent Commerce Engine

> _“From CRUD to Cognition — An AI-powered store that runs entirely on your machine.”_

---

## ⚙️ Core Philosophy

| Principle                    | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| **Self-hosted by design**    | All services (DB, cache, AI, search) run locally via Docker Compose.       |
| **AI, not APIs**             | AI features use **Ollama** (local LLMs & embeddings) instead of paid APIs. |
| **Composable architecture**  | Each version adds one real capability; no premature scaling.               |
| **Showcase-first**           | Every phase runnable with `docker-compose up`, seeded, and demoable.       |
| **Educational storytelling** | Each version documents trade-offs and lessons like _The Accidental CTO_.   |

---

## 🧩 Global Stack Overview

| Layer        | Tech                                            |
| ------------ | ----------------------------------------------- |
| **Backend**  | Node 20 + Express + TypeScript                  |
| **ORM / DB** | TypeORM + PostgreSQL (uses pgvector extension)  |
| **Frontend** | Next.js 14 (App Router) + Tailwind CSS          |
| **Cache**    | Redis (v2+)                                     |
| **Search**   | Elasticsearch (v3+)                             |
| **AI Layer** | **Ollama** (local LLMs + embeddings) + pgvector |
| **Infra**    | Docker Compose + Prometheus + Grafana           |
| **Tooling**  | pnpm, ESLint, Prettier, Jest, Zod               |

---

## 📁 Repository Conventions

- Root: `neuralcart/`
- Versioned folders: `vX_<codename>/`
- Default ports: backend 4000, frontend 3000, Ollama 11434
- Each version includes:
  - `/backend`, `/frontend`, `/docs`
  - `.env.example`, `CHANGELOG.md`, `spec_<codename>.md`
  - Demo GIF or screenshot

---

# 🗺️ Version Roadmap (High Level)

| Version | Codename             | Focus                               |
| ------- | -------------------- | ----------------------------------- |
| **v0**  | **Neural Dawn**      | Monolith CRUD + Storefront          |
| **v1**  | **Divide & Conquer** | Split DB + health checks            |
| **v2**  | **Memory Surge**     | Redis cache + headers               |
| **v3**  | **Echo Search**      | Elasticsearch indexing              |
| **v4**  | **CortexMind**       | Self-hosted AI recommender (Ollama) |
| **v5**  | **Singularity**      | Docker + CI/CD + Monitoring         |

---

# 🧱 v0 — Neural Dawn (Monolith CRUD + Storefront)

**Goal:** Functional e-commerce backend + simple Next.js UI.

### Why

Forms the neural “stem cell.” Everything else grows from this.

### Tasks

1. Create folder `v0_neural_dawn/`.
2. Init monorepo:

   ```bash
   pnpm init -w
   mkdir backend frontend docs
   ```

3. **Backend:** Express + TypeORM + Postgres
   - Entities: User, Category, Product, Order, OrderItem
   - REST API: `/api/v1/products`, `/api/v1/orders`, `/api/v1/users`
4. **Seed script** populating 20 products.
5. **Frontend:** Next.js UI (list → details → checkout).
6. **Docker Compose:** Postgres + App + Frontend.
7. Docs + README + demo GIF.

### Deliverables

- Backend : 4000 ✓
- Frontend : 3000 ✓
- Seeded catalog ✓

### Acceptance

- CRUD works via Postman/UI.
- `docker-compose up` starts entire stack.

---

# ⚙️ v1 — Divide & Conquer (App ↔ DB Separation)

**Goal:** Split DB container, add health checks.

### Tasks

- Add pgAdmin service.
- `/health` endpoint + DB ping.
- `.env` based connection config.
- Graceful shutdown on SIGTERM.
- Docs on PgBouncer & pooling.

### Acceptance

- Restart DB → App recovers.
- `/health` returns `ok`.

---

# ⚡ v2 — Memory Surge (Redis Caching)

**Goal:** Add short-term memory → speed.

### Tasks

- Add Redis service.
- Create `cache.service.ts` (wrapper around ioredis).
- Cache `GET /products`, `GET /products/:id`.
- TTL = 300 s + `X-Cache: HIT|MISS`.
- Invalidate cache on mutations.

### Demo

```bash
curl -I localhost:4000/api/v1/products
```

Expect `MISS` → `HIT`.

---

# 🔍 v3 — Echo Search (Elasticsearch)

**Goal:** Full-text search engine.

### Tasks

- Add Elasticsearch container + index mapping.
- On product create/update → index document.
- `/search?q=term` endpoint.
- Simple Next.js search bar.

### Acceptance

- Search returns ranked results within seconds.
- Reindex script works.

---

# 🧠 v4 — CortexMind (AI Recommendations via Ollama)

**Goal:** AI recommendations without external APIs.

**Why:** Showcase self-hosted AI capability.

### AI Flow

```
New Product → Ollama Embeddings API → pgvector → Top-N Similar Query
```

### Tasks

1. Add Ollama container to docker-compose:

   ```yaml
   ollama:
     image: ollama/ollama
     ports: ["11434:11434"]
     volumes: ["./ollama_data:/root/.ollama"]
   ```

2. Load model (e.g. `all-minilm:latest` or `mxbai-embed-large`).

   ```bash
   docker exec -it ollama ollama pull all-minilm
   ```

3. Add TypeORM migration: `ALTER TABLE product ADD COLUMN vector vector(768);`
4. Create `embeddings-worker.ts`:

   ```ts
   const res = await fetch("http://ollama:11434/api/embeddings", {
     method: "POST",
     body: JSON.stringify({ model: "all-minilm", input: product.description }),
   });
   ```

5. Store `res.embedding` in DB.
6. Endpoint `GET /recommendations?productId=123` → KNN search in pgvector.
7. Mock mode (`EMBEDDINGS_MODE=mock`) for offline demo.

### Acceptance

- Ollama responds locally (no API keys).
- Recommendations plausible for seed data.
- Mock mode works offline.

### Demo

> “CortexMind awakens — local LLM power.”

---

# 🐳 v5 — Singularity (Docker + CI/CD + Monitoring)

**Goal:** Final polish + metrics + CI.

### Tasks

- Dockerize all components (backend, frontend, redis, es, ollama, worker).
- Add GitHub Actions for tests and docker builds.
- Prometheus + Grafana stack:
  - expose `/metrics` → Prometheus scrape.
  - Grafana dashboards (request latency, cache hit ratio).
- `quick-start.sh` → bring entire stack up.
- Final README with badges + GIFs.

### Acceptance

- `./quick-start.sh` starts everything locally.
- Grafana dashboard visible at :3001.
- CI passes on main branch.

---

# 🔩 Cross-cutting Items

- Deterministic seed data.
- `.env.example` with Ollama and DB vars.
- Mock AI mode enabled by default.
- Unit tests for core services.
- Docs and GIF per version.

---

# ⚡ First 72 Hours Plan

1. Scaffold `v0_neural_dawn/` (TypeORM + Postgres CRUD).
2. Seed 20 products.
3. Minimal Next.js UI.
4. Add mock recommendations endpoint (JS cosine similarity).
5. Push README + demo GIF.

---

# 🧩 `.env.example`

```
DB_HOST=db
DB_PORT=5432
DB_USER=neuralcart
DB_PASS=neuralcart
DB_NAME=neuralcart
PORT=4000
REDIS_URL=redis://redis:6379
EMBEDDINGS_MODE=mock
OLLAMA_URL=http://ollama:11434
```

---
