import HomeDashboard from "@/components/home-dashboard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/_home/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const router = useRouter();
  // useEffect(() => {
  //   router.navigate({ to: "/home/management" });
  // }, []);

  return <HomeDashboard />;
}
