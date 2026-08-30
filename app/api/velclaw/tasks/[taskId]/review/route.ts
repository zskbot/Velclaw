import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session/get-server-session'
import { evaluateReviewGate } from '@/lib/velclaw/review'

interface Props { params: Promise<{ taskId: string }> }

export async function GET(_request: Request, { params }: Props) {
  const { taskId } = await params
  const session = await getServerSession()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Review storage/provider wiring is intentionally read-only here. The existing task/review
  // services remain the source of truth; this endpoint normalizes findings for the UI.
  // Until a review exists, expose a pending gate rather than claiming success.
  const findings: never[] = []
  const gate = evaluateReviewGate(findings)

  return NextResponse.json({ taskId, findings, gate: 'pending', checksPassing: undefined, blockingFindings: gate.blockingFindings })
}
