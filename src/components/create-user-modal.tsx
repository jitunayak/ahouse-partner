import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "./ui/form";
import { supabase } from "@/supabaseClient";
import { useState } from "react";
import { toast } from "sonner";

export function CreateUserModal() {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email().min(1),
    role: z.enum(["org-admin", "collector"]),
  });

  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "collector",
    },
  });

  async function handleUseCreation(values: FormSchema) {
    console.log(values);
    setLoading(true);
    try {
      const response = await fetch("/api/v1/create-account", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${
            (await supabase.auth.getSession()).data.session?.access_token
          }`,
        },
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          role: values.role,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      console.log({ response });
      const data = await response.json();
      toast.success("User created successfully", {
        description: "User need to reset password upon login",
      });
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user", {
        description: (error as Error).message,
      });
    } finally {
      setLoading(false);
      form.reset();
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add user</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUseCreation)}>
            <DialogHeader>
              <DialogTitle>Create new account</DialogTitle>
              <DialogDescription>
                Fill in your email below to create your new account.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                          placeholder="m@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Roles</SelectLabel>
                              <SelectItem value="org-admin">Admin</SelectItem>
                              <SelectItem value="collector">
                                Collector
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" isLoading={loading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
