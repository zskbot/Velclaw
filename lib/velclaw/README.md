# Velclaw core

This directory contains the small, dependency-free integration boundary used by the Velclaw platform.

## Current primitives

- `integrations.ts` — canonical registry of adapters and their status.
- `agents.ts` — validates normalized agent execution requests.
- `worktree.ts` — validates task branch/path input and creates a safe Git worktree command plan.
- `review.ts` — evaluates normalized findings against the merge gate.
- `../sandbox/agents/ollama.ts` — executes an Ollama coding agent inside the existing sandbox boundary.

## Integration rule

Adapters should wrap existing capabilities behind stable interfaces. Do not copy entire upstream repositories into the application. Large integrations should land as focused changes with tests and license attribution.

## Execution rule

Velclaw integration code does not execute host processes directly. Agent execution remains inside the configured sandbox/runner, with logs and environment restoration handled by the platform.
