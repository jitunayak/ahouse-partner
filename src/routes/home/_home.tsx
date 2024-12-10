import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useStore } from "@/hooks";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useShallow } from "zustand/react/shallow";

export const Route = createFileRoute("/home/_home")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login, user } = useStore(
    useShallow((s) => ({ user: s.user, login: s.login }))
  );

  if (user === null) {
    login();
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main className="flex flex-1 flex-col bg-muted">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
