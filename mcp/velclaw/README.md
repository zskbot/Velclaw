# VelClaw MCP App

Interactive MCP App for the VelClaw engineering pipeline.

## What is included

- `velclaw_pipeline_status` MCP tool
- UI resource linked with `_meta.ui.resourceUri`
- React-free vanilla widget using `@modelcontextprotocol/ext-apps`
- Single-file Vite bundle via `vite-plugin-singlefile`
- Streamable HTTP transport at `/mcp`
- stdio transport for local MCP hosts
- Text fallback plus `structuredContent` for hosts without UI support

## Build

```bash
npm install
npm run build
```

The build produces `dist/mcp-app.html`, `dist/main.js`, and `dist/server.js`.

## Run

HTTP:

```bash
npm start
```

The MCP endpoint is `http://localhost:3001/mcp` by default.

stdio:

```bash
npm run start:stdio
```

## MCP client configuration

```json
{
  "mcpServers": {
    "velclaw": {
      "command": "bash",
      "args": [
        "-c",
        "cd /path/to/Velclaw/mcp/velclaw && npm install --silent && npm run build --silent && node dist/main.js --stdio"
      ]
    }
  }
}
```

## Architecture

```text
MCP host
  -> velclaw_pipeline_status
  -> ui://velclaw/pipeline.html
  -> VelClaw widget
  -> callServerTool()
  -> velclaw_pipeline_status
```

This first MCP App exposes the pipeline contract without duplicating VelClaw's task database or GitHub credentials. The existing Task → Executor → Review → Gate → GitHub PR services remain the source of truth.
