import { Toaster } from "@/components/ui/sonner";
import { useStore } from "@/hooks";
import { queryClient } from "@/lib";
import { supabase } from "@/supabaseClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import * as React from "react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouter();
  const { setSession } = useStore(
    useShallow((s) => ({ setSession: s.setSession }))
  );

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log({ event, session });
      if (event === "SIGNED_OUT") {
        // handle sign out event
        router.navigate({ to: "/login", replace: true });
      } else if (event === "PASSWORD_RECOVERY") {
        // handle password recovery event
        router.navigate({ to: "/update-password", replace: true });
      } else if (event === "TOKEN_REFRESHED") {
        // handle token refreshed event
      } else if (event === "USER_UPDATED") {
        // handle user updated event
      }
      if (event === "INITIAL_SESSION") {
        // handle initial session
        if (!session) {
          router.navigate({ to: "/login", replace: true });
        }
      }
      if (event === "SIGNED_IN") {
        // handle sign in event
        if (router.matchRoute("/update-password")) {
          // if user is already on the update-password route, don't navigate again
          return;
        } else {
          setSession(session);
          router.navigate({ to: "/home", replace: true });
        }
      }
    });

    return () => {
      // call unsubscribe to remove the callback
      data.subscription.unsubscribe();
    };
  }, []);

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
