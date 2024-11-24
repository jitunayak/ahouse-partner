import { AppSidebar } from "./ui/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { UserManagement } from "./user-management";

export const DashBoard = () => {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <UserManagement />
      </main>
    </SidebarProvider>
  );
};
