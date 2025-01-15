import { ErrorFallback } from "@/components/error-fallback";
import { UserManagement } from "@/components/user-management";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";

export const Route = createLazyFileRoute("/home/_home/management")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorFallback />}>
      <UserManagement />
    </ErrorBoundary>
  );
}
