import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  });

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster richColors theme="light" expand closeButton />
        <TanStackRouterDevtools position="bottom-right" />
      </QueryClientProvider>
    </React.Fragment>
  );
}
