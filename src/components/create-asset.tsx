import { useApi, useStore } from "@/hooks";
import { useAptabase } from "@aptabase/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";
import BranchSelection from "./branch-selection";
import UploadAssetImage from "./image-upload";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
  caseNumber: z.number().min(1, { message: "required" }),
  title: z.string({ message: "required" }),
  description: z.string({ message: "required" }),
  assetType: z.string(),
});

export default function CreateAsset() {
  const { auctionsApi } = useApi();
  const { trackEvent } = useAptabase();

  const [images, setImages] = useState<string[]>([]);
  const [branchLocation, setBranchLocation] = useState<string>("");

  const { user } = useStore(useShallow((state) => ({ user: state.user })));

  const onSuccessfulImageUpload = (image: string) => {
    setImages((images) => [...images, image]);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const buildUploadPath = useCallback(
    (sequence: number) => {
      return (
        user?.org_id +
        "/" +
        new Date().getFullYear() +
        "/" +
        new Date().getMonth() +
        1 +
        "/" +
        new Date().getDate() +
        "/" +
        `${sequence}-auction-${new Date().toISOString()}.jpg`
      );
    },
    [user]
  );

  useEffect(() => {
    setImages([]);
  }, []);

  const { isPending, mutateAsync, isSuccess } = auctionsApi.save({
    title: form.getValues().title,
    case_number: String(form.getValues().caseNumber),
    description: form.getValues().description,
    branch: branchLocation,
    assetType: form.getValues().assetType,
    images: images,
  });

  const handleSubmit = async () => {
    console.log(form.getValues());
    await mutateAsync();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="text-primary"
          onClick={() =>
            trackEvent("create_asset", {
              org_id: user?.org_id!,
              email_address: user?.email_address!,
              user_id: user?.id!,
            })
          }
        >
          Add Asset <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>New Asset</DialogTitle>
          <DialogDescription>
            Make changes to new asset here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6 bg-background">
                <div className="grid gap-x-4 grid-cols-2">
                  <FormField
                    control={form.control}
                    name="caseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case Number</FormLabel>
                        <FormControl>
                          <Input
                            id="caseNumber"
                            type="number"
                            placeholder="e.g. 123456"
                            {...field}
                            value={field.value}
                            onChange={() => {
                              form.setValue("caseNumber", Number(field.value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assetType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asset Type</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select asset type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="land">Land</SelectItem>
                                <SelectItem value="real-estate">
                                  Real Estate
                                </SelectItem>
                                <SelectItem value="vehicle">Vehicle</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          id="title"
                          type="text"
                          placeholder="e.g. Gold Bar of 1kg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          id="description"
                          type="text"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormLabel>Location</FormLabel>
                <BranchSelection
                  value={branchLocation}
                  onChange={setBranchLocation}
                />
                <FormMessage />
              </div>
            </form>
          </Form>
          <div className="grid grid-cols-2 gap-2 bg-neutral-50 dark:bg-neutral-800 border-[.5px] p-4 rounded-md">
            <UploadAssetImage
              url={buildUploadPath(1)}
              onUploaded={onSuccessfulImageUpload}
            />
            <UploadAssetImage
              url={buildUploadPath(2)}
              onUploaded={onSuccessfulImageUpload}
            />
            <UploadAssetImage
              url={buildUploadPath(3)}
              onUploaded={onSuccessfulImageUpload}
            />
            <UploadAssetImage
              url={buildUploadPath(4)}
              onUploaded={onSuccessfulImageUpload}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              type="submit"
              isLoading={isPending}
              disabled={isPending || isSuccess}
              onClick={form.handleSubmit(handleSubmit)}
            >
              Save changes
            </Button>
          </DialogFooter>{" "}
        </div>
      </DialogContent>
    </Dialog>
  );
}
