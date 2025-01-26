import { ErrorFallback } from '@/components/error-fallback'
import { UserManagement } from '@/components/user-management'
import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'

export const Route = createFileRoute('/home/_home/management')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorFallback />}>
      <UserManagement />
    </ErrorBoundary>
  )
}
