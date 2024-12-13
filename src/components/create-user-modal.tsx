import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SubmitBtnArrowRightIcon } from "./animated-icons";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const IUserCreateInput = z.object({
  firstName: z.string().min(1, { message: "first name can not be empty" }),
  lastName: z.string().min(1, { message: "last name can not be empty" }),
  email: z.string().email().min(1),
  role: z.enum(["org-admin", "collector"]),
});

export type IUserCreateInput = z.infer<typeof IUserCreateInput>;

export function CreateUserModal() {
  const { userApi } = useApi();
  const { isError, isPending, mutate, error, isSuccess } = userApi.create();

  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  const form = useForm<IUserCreateInput>({
    mode: "onChange",
    resolver: zodResolver(IUserCreateInput),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "collector",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      close();
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
          <UserIcon className="w-4 h-4 mr-2" />
          Add user
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => mutate(form.getValues()))}>
            <DialogHeader className="pb-8">
              <DialogTitle>Create new account</DialogTitle>
              <DialogDescription>
                Fill in your email below to create your new account.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-8 py-4">
              <div className="grid grid-cols-1 items-center gap-6">
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
              {isError && (
                <Alert variant="destructive">
                  <CircleX className="w-4 h-4" />
                  <AlertTitle>Failed to create</AlertTitle>
                  <AlertDescription>
                    Try after sometime! {error.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => form.reset()}
              >
                Clear
              </Button>
              <SubmitBtnArrowRightIcon
                type="submit"
                isLoading={isPending}
                disabled={isPending}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
