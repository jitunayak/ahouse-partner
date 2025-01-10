import { supabase } from "@/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "@tanstack/react-router";
import { MailIcon, MoveLeft } from "lucide-react";
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
      data.email
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
    <div className="mt-10 min-w-96">
      <Link to="/login">
        <Button variant={"link"}>
          <MoveLeft />
        </Button>
      </Link>
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
                    <div className="relative">
                      <Input
                        placeholder="email"
                        className="peer pe-12 ps-10"
                        type="email"
                        {...field}
                      />
                      <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-md text-muted-foreground peer-disabled:opacity-50">
                        <MailIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !form.formState.isValid}
            >
              Send me recovery link
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PasswordReset;
