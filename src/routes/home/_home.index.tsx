import { ErrorFallback } from "@/components/error-fallback";
import HomeDashboard from "@/components/home-dashboard";
import { createFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";

export const Route = createFileRoute("/home/_home/")({
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
