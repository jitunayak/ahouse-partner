import { Toaster } from "@/components/ui/sonner";
import { queryClient } from "@/lib";
import { supabase } from "@/supabaseClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import * as React from "react";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  // const router = useRouter();
  // const { signOut } = useStore(useShallow((s) => ({ signOut: s.signout })));

  React.useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   if (session) {
    //     return;
    //   } else {
    //     signOut();
    //     router.navigate({ to: "/login", replace: true });
    //   }
    // });
  }, [supabase.auth.onAuthStateChange]);

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster richColors theme="light" expand closeButton />
        {process.env.NODE_ENV !== "production" && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.Fragment>
  );
}
