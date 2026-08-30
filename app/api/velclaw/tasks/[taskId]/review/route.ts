import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session/get-server-session'
import { evaluatePullRequestGate } from '@/lib/velclaw/review-gate'
import { runGitoReview } from '@/lib/velclaw/gito'

interface Props { params: Promise<{ taskId: string }> }

export async function GET(_request: Request, { params }: Props) {
  const { taskId } = await params
  const session = await getServerSession()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // The existing task detail page owns the sandbox/task lookup. The review endpoint remains
  // authenticated and exposes only normalized review data. A live Gito run requires a resolved
  // sandbox context, so this endpoint reports pending until that context is available.
  const findings: never[] = []
  const gate = evaluatePullRequestGate({ findings, checksPassing: false })

  return NextResponse.json({
    taskId,
    findings,
    gate: gate.allowed ? 'passed' : 'pending',
    checksPassing: false,
    blockingFindings: [],
    reviewAvailable: false,
    provider: 'gito',
    reviewRunner: runGitoReview.name,
  })
}
