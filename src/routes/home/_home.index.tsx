import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/home/_home/")({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  useEffect(() => {
    router.navigate({ to: "/home/management" });
  }, []);

  return null;
}
