import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main className="flex flex-1 flex-col bg-muted">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
