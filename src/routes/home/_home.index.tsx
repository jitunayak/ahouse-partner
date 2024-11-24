import { createFileRoute } from "@tanstack/react-router";
import { UserManagement } from "@/components/user-management";

export const Route = createFileRoute("/home/_home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UserManagement />;
}
