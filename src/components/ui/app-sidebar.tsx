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
import { useStore } from "@/hooks";
import { ModeToggle } from "@/hooks/mode-toggle";
import { cn } from "@/lib/utils";
import { supabase } from "@/supabaseClient";
import { User } from "@supabase/supabase-js";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Home, Inbox, Mail, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./button";

const items = [
  {
    title: "Dashboard",
    url: "/home",
    icon: Home,
  },
  {
    title: "User Management",
    url: "/home/management",
    icon: User2,
  },
  {
    title: "Inbox",
    url: "/home/inbox",
    icon: Inbox,
  },
];
export function AppSidebar() {
  const router = useRouter();
  const location = useLocation();
  const { signOut, logoUrl, userInfo } = useStore(
    useShallow((s) => ({
      signOut: s.signout,
      logoUrl: s.user?.logo_url,
      userInfo: s.user,
    }))
  );

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  });

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/login", replace: true });
  };

  return (
    <Sidebar variant="sidebar" className="bg-primary">
      <SidebarHeader className="flex items-start">
        <img
          src={logoUrl}
          alt="logo"
          className="h-10 mt-4 object-contain self-center"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title} className="mx-4">
                <SidebarMenuButton
                  asChild
                  className={cn(
                    " rounded-lg p-5 hover:bg-muted",
                    location.pathname === item.url
                      ? "bg-primary/10 hover:bg-primary/20"
                      : ""
                  )}
                  onClick={() => router.navigate({ to: item.url })}
                >
                  <Link to={item.url} preload="intent">
                    <item.icon
                      className={cn(
                        location.pathname === item.url
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "ml-2 font-medium",
                        location.pathname === item.url
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
      <SidebarFooter>
        <div className="space-y-0">
          <div className="text-sm font-semibold">
            {userInfo?.first_name} {userInfo?.last_name}
          </div>
          <span className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs">
            Version : {import.meta.env.VITE_APP_VERSION}
          </span>
          <ModeToggle />
        </div>
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
