import AssetListing from "@/components/asset-listing";
import { ErrorFallback } from "@/components/error-fallback";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
export const Route = createLazyFileRoute("/home/_home/asset-listing")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ErrorBoundary FallbackComponent={() => <ErrorFallback />}>
      <Suspense>
        <AssetListing />;
      </Suspense>
    </ErrorBoundary>
  );
}
