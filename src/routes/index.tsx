import { supabase } from "@/supabaseClient";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === "SIGNED_IN") {
        router.navigate({ to: "/home", replace: true });
        // handle sign in event
      } else if (event === "SIGNED_OUT") {
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
    });

    return () => {
      // call unsubscribe to remove the callback
      data.subscription.unsubscribe();
    };
  }, []);
  return "";
}
