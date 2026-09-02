import { App } from '@modelcontextprotocol/ext-apps'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import './global.css'

type StageState = 'pending' | 'running' | 'passed' | 'blocked' | 'failed'

type Stage = {
  id: string
  label: string
  state: StageState
}

type Pipeline = {
  taskId?: string
  repository?: string
  pullRequestUrl?: string
  status?: 'pending' | 'running' | 'passed' | 'blocked'
  stages: Stage[]
}

const root = document.getElementById('root')!
const app = new App({ name: 'VelClaw', version: '0.2.0' })

let latest: Pipeline = {
  status: 'pending',
  stages: [
    { id: 'task', label: 'Task', state: 'passed' },
    { id: 'executor', label: 'Executor', state: 'pending' },
    { id: 'review', label: 'Review', state: 'pending' },
    { id: 'gate', label: 'Gate', state: 'pending' },
    { id: 'github', label: 'GitHub PR', state: 'pending' },
  ],
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]!)
}

function text(result: CallToolResult, fallback: string) {
  return result.content?.find((item) => item.type === 'text')?.text ?? fallback
}

function stateLabel(state: StageState) {
  return state.toUpperCase()
}

function render(data: Pipeline) {
  const stageHtml = data.stages
    .map(
      (stage) => `
        <li class="stage ${stage.state}">
          <span class="dot" aria-hidden="true"></span>
          <span>${escapeHtml(stage.label)}</span>
          <small>${stateLabel(stage.state)}</small>
        </li>`,
    )
    .join('')

  const task = data.taskId ? escapeHtml(data.taskId) : '—'
  const repository = data.repository ? escapeHtml(data.repository) : '—'
  const status = data.status ? data.status.toUpperCase() : 'PENDING'

  root.innerHTML = `
    <main>
      <header>
        <div>
          <p class="eyebrow">MCP APP</p>
          <h1>VelClaw</h1>
          <p class="muted">Task → executor → review → gate → GitHub PR</p>
        </div>
        <div class="actions">
          <span class="status ${data.status ?? 'pending'}">${status}</span>
          <button id="refresh" type="button">Refresh</button>
        </div>
      </header>
      <section class="summary">
        <div><span>Task</span><strong>${task}</strong></div>
        <div><span>Repository</span><strong>${repository}</strong></div>
      </section>
      <ol>${stageHtml}</ol>
      <footer>
        <span id="message">${data.pullRequestUrl ? 'Pull request available.' : 'Waiting for pipeline data.'}</span>
        ${data.pullRequestUrl ? '<button id="open-pr" type="button">Open PR</button>' : ''}
      </footer>
    </main>
  `

  document.getElementById('refresh')?.addEventListener('click', async () => {
    const result = await app.callServerTool({ name: 'velclaw_pipeline_status', arguments: {} })
    latest = (result as unknown as { structuredContent?: Pipeline }).structuredContent ?? latest
    render(latest)
  })

  document.getElementById('open-pr')?.addEventListener('click', async () => {
    if (latest.pullRequestUrl) await app.openLink({ url: latest.pullRequestUrl })
  })
}

app.ontoolresult = (result) => {
  const structured = (result as unknown as { structuredContent?: Pipeline }).structuredContent
  if (structured) latest = structured
  render(latest)
  const fallback = document.getElementById('message')
  if (!structured && fallback) fallback.textContent = text(result, 'Pipeline result received.')
}

app.ontoolinput = () => render(latest)

render(latest)
void app.connect()
