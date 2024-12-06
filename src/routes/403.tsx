import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/403")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Unauthorized Access!";
}
