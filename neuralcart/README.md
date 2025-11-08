# NeuralCart Workspace

[![CI](https://github.com/NeuralCart/NeuralCart/actions/workflows/ci.yml/badge.svg)](https://github.com/NeuralCart/NeuralCart/actions/workflows/ci.yml)
[![Docker Images](https://github.com/NeuralCart/NeuralCart/actions/workflows/docker.yml/badge.svg)](https://github.com/NeuralCart/NeuralCart/actions/workflows/docker.yml)

This repository follows the self-hosted roadmap defined in `../ROADMAP.md`.

## Structure

- `v0_neural_dawn/` – Monolithic CRUD foundation with backend, frontend, and docs folders.
- `v1_divide_and_conquer/` – Database separation and service health checks.
- `v2_memory_surge/` – Redis caching layer with diagnostics.
- `v3_echo_search/` – Elasticsearch integration and search UX.
- `v4_cortexmind/` – Ollama-powered recommendations with pgvector.
- `v5_singularity/` – Docker, CI/CD, and observability stack.

## Getting Started

1. Ensure `pnpm` is installed (`npm install -g pnpm`).
2. Install dependencies at the workspace root: `pnpm install`.
3. Follow the version-specific README for the milestone you’re working on (e.g. `v5_singularity/README.md`).
4. Specs live alongside each version in `docs/spec_<codename>.md`.
