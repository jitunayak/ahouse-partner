import HomeDashboard from '@/components/home-dashboard'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/home/_home/')({
  component: RouteComponent,
})

function RouteComponent() {
  // const router = useRouter();
  // useEffect(() => {
  //   router.navigate({ to: "/home/management" });
  // }, []);

  return <HomeDashboard />
}
