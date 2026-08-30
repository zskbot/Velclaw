# Velclaw core

This directory contains the small, dependency-free integration boundary used by the Velclaw platform.

## Current primitives

- `integrations.ts` — canonical registry of planned adapters.
- `worktree.ts` — validates task branch/path input and creates a safe Git worktree command plan.

## Integration rule

Adapters should wrap existing capabilities behind stable interfaces. Do not copy entire upstream repositories into the application. Large integrations should land as focused changes with tests and license attribution.
