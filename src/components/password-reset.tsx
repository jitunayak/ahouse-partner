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

const passwordResetSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});
function PasswordReset() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
  });

  const onSubmit = async (data: z.infer<typeof passwordResetSchema>) => {
    console.log(data);
    setIsLoading(true);
    const { error, data: result } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: `${import.meta.env.VITE_WEB_APP_URL}/update-password`,
      }
    );

    if (error) {
      toast.error(error.message);
      return;
    }
    console.log(result);
    toast.success("Recovery email sent successfully");
    form.reset();
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input placeholder="email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Send me recovery link
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PasswordReset;
