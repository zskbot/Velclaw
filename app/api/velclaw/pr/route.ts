import { NextResponse } from 'next/server'
import { planPullRequest } from '@/lib/velclaw/pr-pipeline'

export async function POST(request: Request) {
  const body = await request.json()
  const plan = planPullRequest({
    branch: body.branch,
    title: body.title,
    body: body.body,
    findings: body.findings ?? [],
  })

  if (!plan.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Review gate blocked pull request creation', blockingFindings: plan.blockingFindings },
      { status: 422 },
    )
  }

  // GitHub PR creation is intentionally delegated to the authenticated GitHub service layer.
  // This route only enforces the Velclaw review gate and returns a validated PR plan.
  return NextResponse.json({ ok: true, plan })
}
