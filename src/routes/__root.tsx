import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/useAuth";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <AuthProvider>
        <Outlet />
        <Toaster richColors theme="light" expand closeButton />
        <TanStackRouterDevtools position="bottom-right" />
      </AuthProvider>
    </React.Fragment>
  );
}
