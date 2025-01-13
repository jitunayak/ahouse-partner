import { ErrorFallback } from "@/components/error-fallback";
import HomeDashboard from "@/components/home-dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";

export const Route = createLazyFileRoute("/home/_home/")({
  component: RouteComponent,
});

function RouteComponent() {
  // const router = useRouter();
  // useEffect(() => {
  //   router.navigate({ to: "/home/management" });
  // }, []);

  return (
    <ErrorBoundary FallbackComponent={() => <ErrorFallback />}>
      <HomeDashboard />
    </ErrorBoundary>
  );
}
