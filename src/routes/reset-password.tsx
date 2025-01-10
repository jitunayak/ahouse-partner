import PasswordReset from "@/components/password-reset";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/reset-password")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 w-screen justify-center h-screen ">
      <PasswordReset />
    </div>
  );
}
