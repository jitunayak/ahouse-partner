import { DashBoard } from "@/components/dashboard";
import { useAuth } from "@/hooks/useAuth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  if (auth.isLoading) {
    return <Outlet />;
  }
  return <DashBoard />;
}
