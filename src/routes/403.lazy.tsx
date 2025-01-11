import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/403')({
  component: RouteComponent,
})

function RouteComponent() {
  return 'Unauthorized Access!'
}
