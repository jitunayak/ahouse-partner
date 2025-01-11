import { createLazyFileRoute } from '@tanstack/react-router'
import { UserManagement } from '@/components/user-management'

export const Route = createLazyFileRoute('/home/_home/management')({
  component: RouteComponent,
})

function RouteComponent() {
  return <UserManagement />
}
