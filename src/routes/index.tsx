import { supabase } from "@/supabaseClient";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event);
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
        router.navigate({ to: "/home", replace: true });
      } 
    });

    return () => {
      // call unsubscribe to remove the callback
      data.subscription.unsubscribe();
    };
  }, []);
  return "";
}
