import { supabase } from "@/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: "Password is required" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Confirm Password is required" }),
});
function UpdatePassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: z.infer<typeof updatePasswordSchema>) => {
    setIsLoading(true);
    const email = (await supabase.auth.getUser()).data?.user?.email;
    console.log(email);
    if (!email) {
      toast.error("User not found");
      return;
    }
    const { error, data: result } = await supabase.auth.updateUser({
      email: email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }
    console.log(result);
    toast.success("Password updated successfully");
    setIsLoading(false);
    router.navigate({ to: "/login", replace: true });
  };

  return (
    <div className="m-10 min-w-96">
      <div className="text-xl font-bold">Reset your password</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-4 mt-10">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UpdatePassword;
