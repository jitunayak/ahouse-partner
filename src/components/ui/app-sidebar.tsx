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
import { Calendar, Home, Inbox, Search, Settings, Mail } from "lucide-react";
import { Button } from "./button";
import { Link, useRouter } from "@tanstack/react-router";

export function AppSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const items = [
    {
      title: "Home",
      url: "/home/management",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/home/inbox",
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
    supabase.auth.signOut().then(() => {
      router.navigate({ to: "/login", replace: true });
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-start">
        <img
          src="https://1000logos.net/wp-content/uploads/2021/06/HDFC-Bank-logo.png"
          alt="logo"
          className="h-14 object-contain scale-120"
        />
        <Button variant={"secondary"} className="flex items-center gap-2">
          <Mail className="w-2 h-2" />
          <span className="text-xs">{user?.email}</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="px-4">
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
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
