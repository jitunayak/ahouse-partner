import * as React from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { supabase } from "@/supabaseClient";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  React.useEffect(() => {
    console.log("supabase.auth.onAuthStateChange");
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.navigate({ to: "/home", replace: true });
      } else {
        router.navigate({ to: "/login", replace: true });
      }
    });
  }, [supabase.auth.onAuthStateChange]);
  return "";
}
