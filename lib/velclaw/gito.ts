import { runCommandInSandbox, type CommandResult } from '@/lib/sandbox/commands'
import type { ReviewFinding } from './review'

export type GitoReviewOptions = {
  token?: string
  model?: string
  apiKey?: string
  apiType?: string
}

export type GitoReviewResult = {
  success: boolean
  findings: ReviewFinding[]
  report?: string
  error?: string
}

function parseFindings(report: string): ReviewFinding[] {
  const findings: ReviewFinding[] = []

  for (const line of report.split('\n')) {
    const match = line.match(/\b(CRITICAL|HIGH|MEDIUM|LOW|INFO)\b[:\-]?\s*(.+)/i)
    if (!match) continue

    const severity = match[1].toLowerCase() as ReviewFinding['severity']
    const message = match[2].trim()
    if (message) findings.push({ severity, message })
  }

  return findings
}

/**
 * Runs Gito inside the existing sandbox. Credentials are supplied through
 * the process environment and are never embedded in the command arguments.
 */
export async function runGitoReview(
  sandbox: Parameters<typeof runCommandInSandbox>[0],
  options: GitoReviewOptions = {},
): Promise<GitoReviewResult> {
  const env: Record<string, string> = {}
  if (options.token) env.GITHUB_TOKEN = options.token
  if (options.apiKey) env.LLM_API_KEY = options.apiKey
  if (options.apiType) env.LLM_API_TYPE = options.apiType
  if (options.model) env.MODEL = options.model

  const envArgs = Object.keys(env).flatMap((key) => ['-e', `${key}=${env[key]}`])

  // The sandbox owns process isolation. The adapter only requests the CLI.
  const result: CommandResult = await runCommandInSandbox(sandbox, 'env', [
    ...envArgs,
    'gito',
    'review',
  ])

  const report = [result.output, result.error].filter(Boolean).join('\n').trim()
  return {
    success: result.success,
    findings: parseFindings(report),
    report,
    ...(result.success ? {} : { error: report || 'Gito review failed' }),
  }
}
