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

const stageState = z.enum(['pending', 'running', 'passed', 'blocked', 'failed'])
const pipelineSchema = z.object({
  taskId: z.string().optional(),
  repository: z.string().optional(),
  pullRequestUrl: z.string().url().optional(),
  stages: z
    .array(
      z.object({
        id: z.enum(['task', 'executor', 'review', 'gate', 'github']),
        state: stageState,
      }),
    )
    .optional(),
})

type Stage = {
  id: 'task' | 'executor' | 'review' | 'gate' | 'github'
  label: string
  state: z.infer<typeof stageState>
}

const defaultStages: Stage[] = [
  { id: 'task', label: 'Task', state: 'passed' },
  { id: 'executor', label: 'Executor', state: 'pending' },
  { id: 'review', label: 'Review', state: 'pending' },
  { id: 'gate', label: 'Gate', state: 'pending' },
  { id: 'github', label: 'GitHub PR', state: 'pending' },
]

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'VelClaw MCP App',
    version: '0.2.0',
  })

  registerAppTool(
    server,
    'velclaw_pipeline_status',
    {
      title: 'VelClaw Pipeline Status',
      description:
        'Show the VelClaw pipeline state: Task, Executor, Review, Gate, and GitHub PR. Accepts current stage states so the host can render live pipeline progress.',
      inputSchema: pipelineSchema.shape,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
      },
      _meta: { ui: { resourceUri: RESOURCE_URI } },
    },
    async ({ taskId, repository, pullRequestUrl, stages }): Promise<CallToolResult> => {
      const stageOverrides = new Map(stages?.map((stage) => [stage.id, stage.state]))
      const resolvedStages = defaultStages.map((stage) => ({
        ...stage,
        state: stageOverrides.get(stage.id) ?? stage.state,
      }))
      const blocked = resolvedStages.some((stage) => stage.state === 'blocked' || stage.state === 'failed')
      const running = resolvedStages.some((stage) => stage.state === 'running')
      const complete = resolvedStages.every((stage) => stage.state === 'passed')
      const status = blocked ? 'blocked' : complete ? 'passed' : running ? 'running' : 'pending'

      return {
        content: [
          {
            type: 'text',
            text: `VelClaw pipeline for ${taskId ?? 'current task'}: ${status}.`,
          },
        ],
        structuredContent: {
          taskId,
          repository,
          pullRequestUrl,
          status,
          stages: resolvedStages,
        },
      }
    },
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
