import UpdatePassword from "@/components/update-password";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/update-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 w-screen justify-center h-screen ">
      <UpdatePassword />
    </div>
  );
}
