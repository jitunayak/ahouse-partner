import { Inbox } from '@/components/inbox'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/home/_home/inbox')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Inbox />
}
