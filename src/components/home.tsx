import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "./ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { UserManagement } from "./user-management";

export const Home = () => {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};
