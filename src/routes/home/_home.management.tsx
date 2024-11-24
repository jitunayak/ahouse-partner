import { createFileRoute } from "@tanstack/react-router";
import { UserManagement } from "@/components/user-management";

export const Route = createFileRoute("/home/_home/management")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserManagement />;
}
