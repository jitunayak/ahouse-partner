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
import { ShieldCheck } from "lucide-react";
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
        className="space-y-8 mt-28 mx-12 z-30"
      >
        <Card className="mx-auto max-w-sm border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl flex flex-row items-center gap-2">
              Login <ShieldCheck size={20} className="text-green-500" />
            </CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                        <Input
                          id="password"
                          type="password"
                          placeholder="********"
                          autoComplete="current-password"
                          {...field}
                        />
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
              <a href="#" className="underline">
                Reset
              </a>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
