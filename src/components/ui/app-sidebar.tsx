import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/hooks";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import { Link, useRouter } from "@tanstack/react-router";
import { Calendar, Home, Inbox, Mail, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./button";

export function AppSidebar() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);

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

  const auth = useAuthStore();

  const handleSignOut = async () => {
    await auth.signout();
    router.navigate({ to: "/login", replace: true });
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex items-start">
        <img
          src={auth.user?.logo_url}
          alt="logo"
          className="h-10 mt-4 object-contain self-center"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item, index) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "ml-2 border-l-4 rounded-none border-l-transparent",
                    selectedTab === index ? "border-l-primary " : ""
                  )}
                  onClick={() => setSelectedTab(index)}
                >
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
        <Mail className="w-4 h-4" />
        <span className="text-xs">{user?.email}</span>
        <span className="text-xs">Version : 1.0.0</span>
        <Button
          variant="secondary"
          onClick={() => handleSignOut()}
          className=""
        >
          Log out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
