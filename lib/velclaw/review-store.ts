import type { ReviewFinding } from './review'

export type ReviewSnapshot = {
  taskId: string
  findings: ReviewFinding[]
  checksPassing: boolean
  status: 'pending' | 'running' | 'passed' | 'blocked' | 'failed'
  updatedAt: string
}

const snapshots = new Map<string, ReviewSnapshot>()

export function setReviewSnapshot(snapshot: ReviewSnapshot) {
  snapshots.set(snapshot.taskId, snapshot)
  return snapshot
}

export function getReviewSnapshot(taskId: string): ReviewSnapshot | null {
  return snapshots.get(taskId) ?? null
}
