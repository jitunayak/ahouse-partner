import { useApi, useStore } from "@/hooks";
import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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

export default function CreateAsset() {
  const { auctionsApi } = useApi();
  const [images, setImages] = useState<string[]>([]);
  const [branchLocation, setBranchLocation] = useState<string>("");

  const { user } = useStore(useShallow((state) => ({ user: state.user })));

  const onSuccessfulImageUpload = (image: string) => {
    setImages((images) => [...images, image]);
  };

  const form = useForm({
    defaultValues: {
      caseNumber: "",
      title: "",
      description: "",
      assetType: "",
    },
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

  const {
    isPending,
    mutateAsync: handleSubmit,
    isSuccess,
  } = auctionsApi.save({
    title: form.getValues().title,
    case_number: form.getValues().caseNumber,
    description: form.getValues().description,
    branch: branchLocation,
    assetType: form.getValues().assetType,
    images: images,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="text-primary">
          Add Asset <PlusIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Asset</DialogTitle>
          <DialogDescription>
            Make changes to new asset here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form>
              <div className="grid gap-4 bg-background">
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
            <div className="grid grid-cols-2 gap-2">
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
          </Form>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => handleSubmit()}
            isLoading={isPending}
            disabled={isPending || isSuccess}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
