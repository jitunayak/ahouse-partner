import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/home/_home/inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return "Hello /home/_inbox!";
}
