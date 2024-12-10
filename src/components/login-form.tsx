import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore } from "@/hooks";
import { supabase } from "@/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { user, session, login } = useStore(
    useShallow((s) => ({ user: s.user, session: s.session, login: s.login }))
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.getValues().email,
      password: form.getValues().password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      form.setError("password", {
        type: "manual",
        message: "Wrong email or password",
      });
      return;
    }
    if (data) {
      login().then(() => {
        router.navigate({ to: "/home", replace: true });
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && session) {
      router.navigate({ to: "/home", replace: true });
    }
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 flex flex-1 items-center mx-12 z-30"
      >
        <Card className="mx-auto max-w-sm border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl flex flex-row items-center gap-2">
              Login
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="m@bankdomain.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            id="password"
                            type={isVisible ? "text" : "password"}
                            placeholder="********"
                            autoComplete="current-password"
                            {...field}
                          />
                          <button
                            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label={
                              isVisible ? "Hide password" : "Show password"
                            }
                            aria-pressed={isVisible}
                            aria-controls="password"
                          >
                            {isVisible ? (
                              <EyeOff
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            ) : (
                              <Eye
                                size={16}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" isLoading={loading} className="w-full">
                Sign in
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Forgot account password?{" "}
              <a href="#" className="text-primary">
                Reset
              </a>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
