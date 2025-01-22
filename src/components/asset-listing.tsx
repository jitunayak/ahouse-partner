import { useApi, useStore } from "@/hooks";
import { queryClient } from "@/lib";
import { QueryKeys } from "@/types/enum";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Check,
  CornerLeftDown,
  NewspaperIcon,
  Search,
  SendIcon,
  TrashIcon,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { ErrorFallback } from "./error-fallback";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function AssetListing() {
  const { auctionsApi } = useApi();
  const { user } = useStore(useShallow((s) => ({ user: s.user })));
  const [searchValue, setSetSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState<typeof data>([]);
  const [selectedItems, setSelectedItems] = useState<typeof data>([]);
  const { data, isPending, isError, isSuccess } = auctionsApi.list();
  const [enableSelectMode, setEnableSelectMode] = useState(false);

  const handleSelect = (item: any) => {
    if (!item || !selectedItems) return;

    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };
  useEffect(() => {
    if (isError || !isSuccess) return;
    if (searchValue) {
      setFilteredItems(
        data.filter((d) =>
          JSON.stringify(d).toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setFilteredItems(data);
    }
  }, [data, searchValue]);

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await auctionsApi.delete(id);
    },
    onSuccess: () => {
      toast.success("Asset deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id],
      });
    },
  });

  const publishItemMutation = useMutation({
    mutationFn: async (id: string) => {
      await auctionsApi.readyForPublish(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id],
      });
      toast.success("Asset sent for approval");
    },
  });

  const sentItBackMutation = useMutation({
    mutationFn: async (id: string) => {
      await auctionsApi.readyForUpdate(id);
    },
    onSuccess: () => {
      toast("Asset sent back to review and update");
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "created"],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "submitted"],
      });
    },
  });

  if (isPending || !isSuccess) return <ErrorFallback type="loading" />;
  if (isError) {
    return <p>Error: {isError}</p>;
  }

  return (
    <div className="">
      <div className="fixed flex items-center w-fit flex-1 justify-between bg-neutral-100 z-50 px-10">
        <div className="flex items-center py-4 gap-6">
          <div className="relative w-full">
            <Input
              placeholder="search..."
              className="min-w-96 peer bg-background pl-10"
              value={searchValue}
              onChange={(e) => setSetSearchValue(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <Search size={16} strokeWidth={2} />
            </div>
          </div>
        </div>
        <div className="px-4 gap-2 flex">
          <Button
            variant={"outline"}
            disabled={!enableSelectMode || selectedItems?.length === 0}
          >
            <NewspaperIcon className="mr-2 h-4 w-4 scale-90" /> Trigger
            newspaper
          </Button>

          <Button
            variant={"outline"}
            isLoading={publishItemMutation.isPending}
            disabled={!enableSelectMode || selectedItems?.length === 0}
            onClick={() =>
              selectedItems?.map((a) => publishItemMutation.mutateAsync(a.id))
            }
          >
            {!publishItemMutation.isPending && <SendIcon className="h-4 w-4" />}
            Publish
          </Button>
          <Button
            variant={"outline"}
            isLoading={sentItBackMutation.isPending}
            disabled={!enableSelectMode || selectedItems?.length === 0}
            onClick={() =>
              selectedItems?.map((a) => sentItBackMutation.mutateAsync(a.id))
            }
          >
            {!sentItBackMutation.isPending && (
              <CornerLeftDown className="h-4 w-4" />
            )}
            Send back
          </Button>
          <Button
            variant={"outline"}
            isLoading={deleteItemMutation.isPending}
            disabled={!enableSelectMode || selectedItems?.length === 0}
            onClick={() =>
              selectedItems?.map((a) => deleteItemMutation.mutateAsync(a.id))
            }
          >
            {!deleteItemMutation.isPending && <TrashIcon className="h-4 w-4" />}
            Delete
          </Button>

          <Button
            variant={"outline"}
            onClick={() => {
              if (enableSelectMode) {
                setSelectedItems([]);
              }
              setEnableSelectMode(!enableSelectMode);
            }}
          >
            {enableSelectMode ? (
              <span>Cancel</span>
            ) : (
              <>
                <Check className="h-4 w-4" /> <span>Select</span>
              </>
            )}
          </Button>
        </div>
      </div>
      <Suspense>
        {filteredItems &&
          (filteredItems.length == 0 ? (
            <div className="flex flex-col items-center">
              <Alert className="rounded w-fit" variant={"default"}>
                <AlertTitle>No items to view</AlertTitle>
                <AlertDescription>
                  Add some new assets to see here or change your search value
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <div className="mt-20 scrollbar-hide ">
              {enableSelectMode && (
                <div className="text-sm ml-6">
                  {selectedItems?.length} are selected{" "}
                </div>
              )}
              {filteredItems.map((a) => (
                <div
                  key={a.id}
                  onClick={() => enableSelectMode && handleSelect(a)}
                  className="border border-gray-200 bg-background p-4 m-4 rounded-lg hover:shadow gap-4"
                >
                  <div className="grid grid-cols-3 justify-between ">
                    <div className="space-y-2 col-span-2">
                      <div className="inline-flex items-center gap-2">
                        {enableSelectMode && (
                          <input
                            type="checkbox"
                            checked={selectedItems?.includes(a)}
                            onChange={() => handleSelect(a)}
                          />
                        )}
                        <p className="text-md">{a.title}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {a.images.map((image: string) => {
                          return (
                            <img
                              className="w-40 h-40 object-cover rounded"
                              src={
                                image.startsWith("http")
                                  ? image
                                  : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${image}`
                              }
                              alt=""
                            />
                          );
                        })}
                      </div>
                      <p className="text-neutral-600 text-sm">
                        {a.description}
                      </p>
                    </div>
                    <div className="grid col-span-1 h-auto grid-cols-2 gap-4 border bg-neutral-50 p-4 rounded">
                      <div className="text-xs text-gray-500 ">
                        Case Number:
                        <div className="text-xs text-gray-800 font-semibold ">
                          {a.case_number}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Auction Date:
                        <div className="text-xs text-gray-800 font-semibold">
                          {a.start_time ? format(a.start_time, "PPP") : "N/A"}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 ">
                        EMD Amount:
                        <div className="text-xs text-gray-800 font-semibold ">
                          {a.emd_amount
                            ? Number(a.emd_amount).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Asset Value:{" "}
                        <div className="text-xs text-gray-800 font-semibold ">
                          {a.asset_value
                            ? Number(a.asset_value).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </Suspense>
    </div>
  );
}

export default AssetListing;
