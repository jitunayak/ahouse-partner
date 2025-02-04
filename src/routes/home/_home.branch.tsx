import { Branch } from "@/components/branch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/_home/branch")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Branch />;
}
