import { ErrorFallback } from "@/components/error-fallback";
import { Inbox } from "@/components/inbox";
import { createLazyFileRoute } from "@tanstack/react-router";
import { ErrorBoundary } from "react-error-boundary";

export const Route = createLazyFileRoute("/home/_home/inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorFallback />}>
      <Inbox />
    </ErrorBoundary>
  );
}
