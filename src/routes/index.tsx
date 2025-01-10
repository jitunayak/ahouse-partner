import { supabase } from "@/supabaseClient";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import * as React from "react";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  React.useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   if (session) {
    //     router.navigate({ to: "/home", replace: true });
    //   } else {
    //     router.navigate({ to: "/login", replace: true });
    //   }
    // });
  }, [supabase.auth.onAuthStateChange]);
  return "";
}
