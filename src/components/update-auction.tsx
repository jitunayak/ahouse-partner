import { Calendar } from "@/components/ui/calendar";
import { useApi } from "@/hooks";
import { cn, convertNumberToWords } from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type IProps = {
  id: number;
  title: string;
  emdAmount: number;
  assetValue: number;
  auctionDate: Date;
};

function UpdateAuction({
  title,
  id,
  assetValue,
  auctionDate,
  emdAmount,
}: IProps) {
  const updateAuctionSchema = z.object({
    auctionDate: z
      .date({ message: "Auction date must be specified" })
      .min(new Date(), { message: "Start date must be in the future" }),
    emdAmount: z
      .number()
      .min(1, { message: "EMD amount must be greater than 0" }),
    assetValue: z
      .number()
      .min(1, { message: "Bid amount must be greater than 0" }),
  });

  const form = useForm<z.infer<typeof updateAuctionSchema>>({
    resolver: zodResolver(updateAuctionSchema),
    defaultValues: {
      auctionDate: auctionDate,
      emdAmount: emdAmount,
      assetValue: assetValue,
    },
  });

  const { auctionsApi } = useApi();

  const { isPending, mutateAsync } = auctionsApi.update({
    id: id,
    assetValue: form.getValues("assetValue"),
    emdAmount: form.getValues("emdAmount"),
    auctionDate: form.getValues("auctionDate"),
  });
  const handleSubmit = async () => {
    await mutateAsync();
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"ghost"} className="">
            Update
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>{title.substring(0, 30)}...</DialogTitle>
            <DialogDescription>
              Make changes to asset here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6 mt-4">
                <FormField
                  control={form.control}
                  name="assetValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset Value</FormLabel>
                      <FormControl>
                        <div>
                          <div className="relative">
                            <Input
                              id={field.name}
                              className="peer pe-12 ps-6"
                              placeholder="0.00"
                              type="number"
                              value={field.value}
                              onChange={(e) => {
                                form.setValue(
                                  field.name,
                                  Number(e.target.value)
                                );
                              }}
                            />
                            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-md text-muted-foreground peer-disabled:opacity-50">
                              ₹
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                              INR
                            </span>
                          </div>
                          <div className="text-xs p-2 text-neutral-500">
                            {convertNumberToWords(Number(field.value))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="auctionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auction Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal text-sm",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date: Date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emdAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>EMD Amount</FormLabel>
                      <FormControl>
                        <div>
                          <div className="relative">
                            <Input
                              id={field.name}
                              className="peer pe-12 ps-6"
                              placeholder="0.00"
                              type="number"
                              value={field.value}
                              onChange={(e) => {
                                form.setValue(
                                  field.name,
                                  Number(e.target.value)
                                );
                              }}
                            />
                            <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-md text-muted-foreground peer-disabled:opacity-50">
                              ₹
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm text-muted-foreground peer-disabled:opacity-50">
                              INR
                            </span>
                          </div>
                          <div className="text-xs p-2 text-neutral-500">
                            {convertNumberToWords(Number(field.value))}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="reset"
                  variant={"outline"}
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  isLoading={isPending}
                  disabled={isPending}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UpdateAuction;
