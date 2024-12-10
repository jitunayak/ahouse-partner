import { LoginForm } from "@/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 w-screen justify-center h-screen ">
      <div className=" w-[calc(100%-530px)] mr-12">
        <div className=" flex flex-col items-center justify-center w-full bg-primary/10 h-[calc(100vh-50px)] rounded-2xl m-6">
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-primary to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative  font-bold tracking-tight">
            Auction House <br /> Partner Portal <br />
          </h2>
          <p className="max-w-2xl mx-auto text-xs md:text-lg text-neutral-400 dark:text-neutral-200 text-center">
            A platform for buying and selling prepossessed cars, houses,
            plots,golds, etc.
          </p>
        </div>
      </div>
      <LoginForm />
    </div>
  );
}
