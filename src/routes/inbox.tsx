import { createFileRoute } from "@tanstack/react-router";
import { Inbox } from "@/components/inbox";

export const Route = createFileRoute("/inbox")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Inbox />;
}
