import { CatalystShell } from '@/features/catalyst/components/CatalystShell'
import { TasksView } from '@/features/catalyst/components/tasks/TasksView'

export default function CatalystTasksPage(): JSX.Element {
  return (
    <CatalystShell>
      <TasksView />
    </CatalystShell>
  )
}
