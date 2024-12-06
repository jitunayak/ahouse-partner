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
import { Link, useRouter } from "@tanstack/react-router";
import { Home, Inbox, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./button";

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
];
export function AppSidebar() {
  const router = useRouter();
  const { signOut, logo_url, userInfo } = useStore(
    useShallow((s) => ({
      signOut: s.signout,
      logo_url: s.user?.logo_url,
      userInfo: s.user,
    }))
  );
  const [selectedTab, setSelectedTab] = useState(0);
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
    <Sidebar>
      <SidebarHeader className="flex items-start">
        <img
          src={logo_url}
          alt="logo"
          className="h-10 mt-4 object-contain self-center"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item, index) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "ml-2 border-l-4 rounded-none border-l-transparent p-5",
                    selectedTab === index ? "border-l-primary bg-secondary" : ""
                  )}
                  onClick={() => setSelectedTab(index)}
                >
                  <Link href={item.url}>
                    <item.icon
                      className={cn(
                        selectedTab === index
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "ml-2 font-medium",
                        selectedTab === index
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
          <div className="text-md font-semibold">
            {userInfo?.first_name} {userInfo?.last_name}
          </div>
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{user?.email}</span>
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
