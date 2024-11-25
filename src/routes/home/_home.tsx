import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/hooks";

export const Route = createFileRoute("/home/_home")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuthStore();

  if (auth.user === null) {
    auth.login();
    return null;
  }

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
