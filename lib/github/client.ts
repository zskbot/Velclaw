import { Octokit } from '@octokit/rest'
import { getUserGitHubToken } from './user-token'

export async function getOctokit(): Promise<Octokit> {
  const userToken = await getUserGitHubToken()
  if (!userToken) console.warn('No user GitHub token available. User needs to connect their GitHub account.')
  return new Octokit({ auth: userToken || undefined })
}

export async function getGitHubUser(): Promise<{ username: string; name: string | null; email: string | null } | null> {
  try {
    const octokit = await getOctokit()
    if (!octokit.auth) return null
    const { data } = await octokit.rest.users.getAuthenticated()
    return { username: data.login, name: data.name, email: data.email }
  } catch (error) {
    console.error('Error getting GitHub user:', error)
    return null
  }
}

export function parseGitHubUrl(repoUrl: string): { owner: string; repo: string } | null {
  const match = repoUrl.match(/github\.com[/:]([\w-]+)\/([\w-]+?)(\.git)?$/)
  return match ? { owner: match[1], repo: match[2] } : null
}

interface CreatePullRequestParams { repoUrl: string; branchName: string; title: string; body?: string; baseBranch?: string }
interface CreatePullRequestResult { success: boolean; prUrl?: string; prNumber?: number; error?: string }

export async function createPullRequest(params: CreatePullRequestParams): Promise<CreatePullRequestResult> {
  const { repoUrl, branchName, title, body = '', baseBranch = 'main' } = params
  try {
    const octokit = await getOctokit()
    if (!octokit.auth) return { success: false, error: 'GitHub account not connected' }
    const parsed = parseGitHubUrl(repoUrl)
    if (!parsed) return { success: false, error: 'Invalid GitHub repository URL' }
    const response = await octokit.rest.pulls.create({ owner: parsed.owner, repo: parsed.repo, title, body, head: branchName, base: baseBranch })
    return { success: true, prUrl: response.data.html_url, prNumber: response.data.number }
  } catch (error: unknown) {
    console.error('Error creating pull request:', error)
    const status = error && typeof error === 'object' && 'status' in error ? (error as { status: number }).status : 0
    if (status === 422) return { success: false, error: 'Pull request already exists or branch does not exist' }
    if (status === 403) return { success: false, error: 'Permission denied. Check repository access' }
    if (status === 404) return { success: false, error: 'Repository not found or no access' }
    return { success: false, error: 'Failed to create pull request' }
  }
}

export async function getPullRequestStatus(params: { repoUrl: string; prNumber: number }) {
  try {
    const octokit = await getOctokit()
    if (!octokit.auth) return { success: false, error: 'GitHub account not connected' }
    const parsed = parseGitHubUrl(params.repoUrl)
    if (!parsed) return { success: false, error: 'Invalid GitHub repository URL' }
    const { data } = await octokit.rest.pulls.get({ owner: parsed.owner, repo: parsed.repo, pull_number: params.prNumber })
    return { success: true, status: data.merged_at ? 'merged' as const : data.state === 'closed' ? 'closed' as const : 'open' as const, mergeCommitSha: data.merge_commit_sha || undefined }
  } catch { return { success: false, error: 'Failed to get pull request status' } }
}

export async function getPullRequestChecks(params: { repoUrl: string; prNumber: number }) {
  try {
    const octokit = await getOctokit()
    if (!octokit.auth) return { success: false, error: 'GitHub account not connected' }
    const parsed = parseGitHubUrl(params.repoUrl)
    if (!parsed) return { success: false, error: 'Invalid GitHub repository URL' }
    const pr = await octokit.rest.pulls.get({ owner: parsed.owner, repo: parsed.repo, pull_number: params.prNumber })
    const sha = pr.data.head.sha
    const checks = await octokit.rest.checks.listForRef({ owner: parsed.owner, repo: parsed.repo, ref: sha })
    const statuses = checks.data.check_runs.map((check) => ({ name: check.name, status: check.status, conclusion: check.conclusion, url: check.html_url }))
    const completed = statuses.filter((check) => check.status === 'completed')
    const passing = completed.length > 0 && completed.every((check) => check.conclusion === 'success' || check.conclusion === 'neutral' || check.conclusion === 'skipped')
    return { success: true, headSha: sha, checks: statuses, passing, pending: statuses.some((check) => check.status !== 'completed') }
  } catch (error) {
    console.error('Error getting pull request checks:', error)
    return { success: false, error: 'Failed to get pull request checks' }
  }
}
