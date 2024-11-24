import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/home/_home")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();

  if (auth?.isLoading) return <div>Loading...</div>;

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
