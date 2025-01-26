import { ErrorFallback } from '@/components/error-fallback'
import { Inbox } from '@/components/inbox'
import { createFileRoute } from '@tanstack/react-router'
import { ErrorBoundary } from 'react-error-boundary'

export const Route = createFileRoute('/home/_home/inbox')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorFallback />}>
      <Inbox />
    </ErrorBoundary>
  )
}
