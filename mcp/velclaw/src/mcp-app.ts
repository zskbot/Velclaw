import { App } from '@modelcontextprotocol/ext-apps'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import './global.css'

type Stage = {
  id: string
  label: string
  state: 'pending' | 'ready'
}

type Pipeline = {
  taskId?: string
  repository?: string
  pullRequestUrl?: string
  stages: Stage[]
}

const root = document.getElementById('root')!
const app = new App({ name: 'VelClaw', version: '0.1.0' })

let latest: Pipeline = {
  stages: [
    { id: 'task', label: 'Task', state: 'ready' },
    { id: 'executor', label: 'Executor', state: 'pending' },
    { id: 'review', label: 'Review', state: 'pending' },
    { id: 'gate', label: 'Gate', state: 'pending' },
    { id: 'github', label: 'GitHub PR', state: 'pending' },
  ],
}

function text(result: CallToolResult, fallback: string) {
  return result.content?.find((item) => item.type === 'text')?.text ?? fallback
}

function render(data: Pipeline) {
  const stageHtml = data.stages
    .map(
      (stage) => `
        <li class="stage ${stage.state}">
          <span class="dot" aria-hidden="true"></span>
          <span>${stage.label}</span>
          <small>${stage.state === 'ready' ? 'READY' : 'PENDING'}</small>
        </li>`,
    )
    .join('')

  root.innerHTML = `
    <main>
      <header>
        <div>
          <p class="eyebrow">MCP APP</p>
          <h1>VelClaw</h1>
          <p class="muted">Task → executor → review → gate → GitHub PR</p>
        </div>
        <button id="refresh" type="button">Refresh</button>
      </header>
      <section class="summary">
        <div><span>Task</span><strong>${data.taskId ?? '—'}</strong></div>
        <div><span>Repository</span><strong>${data.repository ?? '—'}</strong></div>
      </section>
      <ol>${stageHtml}</ol>
      <footer>
        <span id="message">${data.pullRequestUrl ? 'Pull request available.' : 'Waiting for pipeline data.'}</span>
        ${data.pullRequestUrl ? `<button id="open-pr" type="button">Open PR</button>` : ''}
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
