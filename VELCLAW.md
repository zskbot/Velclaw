# Velclaw

Velclaw is the unified ZSKBOT AI coding-agent platform.

## Product direction

Velclaw combines repository-aware coding agents, isolated workspaces, Git automation, pull requests, AI code review, local LLM support, MCP, and extensible skills behind one workflow.

## Core workflow

1. Authenticate and select a repository.
2. Create a task and isolated agent workspace.
3. Select a cloud or local coding agent.
4. Let the agent inspect, modify, and test the code.
5. Review the diff and AI findings.
6. Commit and push a dedicated branch.
7. Open a pull request.
8. Run automated quality/security review.
9. Merge only when configured checks and review gates pass.

## Integration plan

- `coding-agent-platform`: application and orchestration foundation.
- `Gito`: AI code-review integration.
- `code-ollama`: local Ollama coding-agent integration.
- `git-worktree-runner`: isolated Git workspaces.
- `skills` / `awesome-claude-skills`: extensible agent skills.
- `SandboxCode`: selected documentation, CI/CD, and deployment patterns.
- `rikkahub-agent`: selected agent/tool/approval architecture patterns; Android-specific implementation remains separate.
- `docs-web`: Velclaw product documentation and website content.

## Principles

- Reuse capabilities, not entire unrelated repositories.
- Preserve upstream licenses and attribution.
- Keep secrets out of source control.
- Isolate agent execution from the application host.
- Require explicit approval for destructive or privileged actions.
- Prefer small, testable adapters over tightly coupled integrations.

## Initial milestone

Establish a clean platform shell, provider abstraction, repository/task workflow, isolated execution, GitHub branch/PR automation, and an optional AI review pipeline. Later milestones add local agents, MCP, skills, richer observability, and deployment automation.
