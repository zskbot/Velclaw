import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session/get-server-session'
import { getReviewSnapshot } from '@/lib/velclaw/review-store'

interface Props { params: Promise<{ taskId: string }> }

export async function GET(_request: Request, { params }: Props) {
  const { taskId } = await params
  const session = await getServerSession()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const snapshot = getReviewSnapshot(taskId)
  if (!snapshot) {
    return NextResponse.json({ taskId, findings: [], gate: 'pending', checksPassing: false, reviewAvailable: false })
  }

  return NextResponse.json({
    taskId,
    findings: snapshot.findings,
    gate: snapshot.status === 'passed' ? 'passed' : snapshot.status === 'blocked' ? 'blocked' : 'pending',
    checksPassing: snapshot.checksPassing,
    reviewAvailable: true,
    updatedAt: snapshot.updatedAt,
  })
}
