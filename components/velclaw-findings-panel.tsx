'use client'

import { useEffect, useState } from 'react'

type Finding = { severity?: string; message?: string; file?: string; line?: number }

type ReviewState = { findings: Finding[]; gate?: 'passed' | 'blocked' | 'pending'; checksPassing?: boolean }

export function VelclawFindingsPanel({ taskId }: { taskId: string }) {
  const [review, setReview] = useState<ReviewState>({ findings: [], gate: 'pending' })

  useEffect(() => {
    let stopped = false
    async function refresh() {
      try {
        const response = await fetch(`/api/velclaw/tasks/${encodeURIComponent(taskId)}/review`, { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (!stopped) setReview(data)
      } catch { /* transient polling failure */ }
    }
    refresh()
    const timer = window.setInterval(refresh, 5000)
    return () => { stopped = true; window.clearInterval(timer) }
  }, [taskId])

  return (
    <section className="rounded-lg border p-4" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Gito Review & Gate</h2>
          <p className="text-xs text-muted-foreground">Live review findings and merge eligibility</p>
        </div>
        <span className="rounded-full border px-2 py-1 text-xs">{review.gate || 'pending'}</span>
      </div>
      {review.checksPassing === false && <p className="mt-3 text-sm">CI checks are not passing.</p>}
      {review.findings.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No findings reported.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {review.findings.map((finding, index) => (
            <li key={`${finding.file}-${finding.line}-${index}`} className="rounded-md border p-2 text-sm">
              <div className="font-medium">{finding.severity || 'info'}{finding.file ? ` · ${finding.file}` : ''}{finding.line ? `:${finding.line}` : ''}</div>
              <div className="text-muted-foreground">{finding.message || 'No message'}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
