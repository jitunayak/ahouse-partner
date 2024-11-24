import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "@tanstack/react-router";

export function AppSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },

    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  });

  const handleSignOut = () => {
    supabase.auth.signOut();
    router.navigate({ to: "/login", replace: true });
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div>Logo</div>
        <span className="text-sm">{user?.email}</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <span className="text-xs">Version : 1.0.0</span>
        <Button
          variant="secondary"
          onClick={() => handleSignOut()}
          className="bg-red-50 text-red-600"
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
