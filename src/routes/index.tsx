import * as React from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { supabase } from "@/supabaseClient";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      router.navigate({ to: "/dashboard", replace: true });
    } else {
      router.navigate({ to: "/login", replace: true });
    }
  });
  return "Hello /!";
}
