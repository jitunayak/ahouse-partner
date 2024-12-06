import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/supabaseClient";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import * as React from "react";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
    },
  });
  const router = useRouter();

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log({ session });
      if (session) {
        return;
      } else {
        router.navigate({ to: "/login", replace: true });
      }
    });
  }, [supabase.auth.onAuthStateChange]);

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
