import AssetListing from "@/components/asset-listing";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/home/_home/asset-listing")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AssetListing />;
}
