import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
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
  const form = useForm({
    defaultValues: {
      caseNumber: "",
      description: "",
      location: "",
      assetType: "",
    },
  });

  const handleSubmit = async () => {
    const response = await fetch("/api/asset", {
      method: "POST",
      body: JSON.stringify(form.getValues()),
    });
    if (response.ok) {
      alert("Asset created successfully");
    } else {
      alert("Error creating asset");
    }
  };

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
            <form onSubmit={() => handleSubmit()}>
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
                  name="assetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Type</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder="Select asset type"
                              {...field}
                            />
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
                <BranchSelection />
                <FormMessage />
              </div>
            </form>
            <div className="grid grid-cols-2 gap-2">
              <UploadAssetImage />
              <UploadAssetImage />
              <UploadAssetImage />
              <UploadAssetImage />
            </div>
          </Form>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
