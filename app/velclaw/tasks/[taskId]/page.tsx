import { VelclawTaskConsole } from '@/components/velclaw-task-console'
import { TaskPageClient } from '@/components/task-page-client'
import { getServerSession } from '@/lib/session/get-server-session'
import { getGitHubStars } from '@/lib/github-stars'
import { getMaxSandboxDuration } from '@/lib/db/settings'

interface Props { params: Promise<{ taskId: string }> }

export default async function VelclawTaskPage({ params }: Props) {
  const { taskId } = await params
  const session = await getServerSession()
  const maxSandboxDuration = await getMaxSandboxDuration(session?.user?.id)
  const stars = await getGitHubStars()

  return (
    <div className="flex min-h-screen flex-col gap-4 p-4">
      <VelclawTaskConsole taskId={taskId} />
      <div className="min-h-[600px]">
        <TaskPageClient
          taskId={taskId}
          user={session?.user ?? null}
          authProvider={session?.authProvider ?? null}
          initialStars={stars}
          maxSandboxDuration={maxSandboxDuration}
        />
      </div>
    </div>
  )
}
