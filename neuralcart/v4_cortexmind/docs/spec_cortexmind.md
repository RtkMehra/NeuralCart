# CortexMind Specification

## Overview

Deliver self-hosted AI recommendations leveraging Ollama embeddings and pgvector similarity search.

## Scope

- Add Ollama container to compose with persistent model volume.
- Implement embeddings worker/service to call Ollama, generate vectors, and store them with pgvector.
- Migrate database to include a ector column on products and supporting indexes.
- Provide GET /recommendations?productId= endpoint returning top-N similar products.
- Support EMBEDDINGS_MODE=mock to simulate recommendations without Ollama.
- Update frontend product detail page to render recommended products carousel or section.

## Constraints

- Worker must batch or debounce embedding generation to avoid redundant calls.
- Recommendation endpoint should fail gracefully if embeddings are unavailable (return empty list with message).
- Model selection configurable via environment variables (e.g., ll-minilm, mxbai-embed-large).

## Acceptance Criteria

1. docker-compose starts Ollama, loads required model, and shares volume for persistence.
2. Creating a product triggers embedding generation and vector storage; mock mode bypasses external calls.
3. Recommendation endpoint returns ordered list of similar products with similarity score metadata.
4. Frontend displays recommendations when available and shows fallback messaging otherwise.
5. Documentation includes guidance for pulling models, tuning dimensions, and toggling mock mode.
