import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE,
} from '@modelcontextprotocol/ext-apps/server'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult, ReadResourceResult } from '@modelcontextprotocol/sdk/types.js'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

const DIST_DIR = path.join(import.meta.dirname, 'dist')
const RESOURCE_URI = 'ui://velclaw/pipeline.html'

const pipelineSchema = z.object({
  taskId: z.string().optional(),
  repository: z.string().optional(),
  pullRequestUrl: z.string().url().optional(),
})

const stages = [
  { id: 'task', label: 'Task', state: 'ready' as const },
  { id: 'executor', label: 'Executor', state: 'pending' as const },
  { id: 'review', label: 'Review', state: 'pending' as const },
  { id: 'gate', label: 'Gate', state: 'pending' as const },
  { id: 'github', label: 'GitHub PR', state: 'pending' as const },
]

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'VelClaw MCP App',
    version: '0.1.0',
  })

  registerAppTool(
    server,
    'velclaw_pipeline_status',
    {
      title: 'VelClaw Pipeline Status',
      description:
        'Show the VelClaw task pipeline: Task, Executor, Review, Gate, and GitHub PR. Returns text fallback plus structured data for the interactive UI.',
      inputSchema: pipelineSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async ({ taskId, repository, pullRequestUrl }): Promise<CallToolResult> => ({
      content: [
        {
          type: 'text',
          text: `VelClaw pipeline for ${taskId ?? 'current task'}: Task ready; Executor pending; Review pending; Gate pending; GitHub PR pending.`,
        },
      ],
      structuredContent: {
        taskId,
        repository,
        pullRequestUrl,
        stages,
      },
    }),
  )

  registerAppResource(
    server,
    'VelClaw Pipeline UI',
    RESOURCE_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async (): Promise<ReadResourceResult> => {
      const html = await readFile(path.join(DIST_DIR, 'mcp-app.html'), 'utf8')
      return {
        contents: [
          {
            uri: RESOURCE_URI,
            mimeType: RESOURCE_MIME_TYPE,
            text: html,
          },
        ],
      }
    },
  )

  return server
}
