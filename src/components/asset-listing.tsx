import { useApi, useStore } from "@/hooks";
import { queryClient } from "@/lib";
import { QueryKeys } from "@/types/enum";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CornerLeftDown, Search, SendIcon, TrashIcon } from "lucide-react";
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

  const { data, isPending, isError, isSuccess } = auctionsApi.list();

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
    <div>
      <div className="">
        <div className="flex items-center py-4 gap-6">
          <div className="relative w-full mx-4">
            <Input
              placeholder="search..."
              className="w-full bg-background pl-10"
              value={searchValue}
              onChange={(e) => setSetSearchValue(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              <Search size={16} strokeWidth={2} />
            </div>
          </div>
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
            filteredItems.map((a) => (
              <div
                key={a.id}
                className="border border-gray-200 bg-background p-4 m-4 rounded-lg hover:shadow gap-4 grid"
              >
                <div className="flex flex-1 justify-between ">
                  <div className="space-y-2">
                    <p className="text-md">{a.title}</p>

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
                    <p className="text-neutral-600 text-sm">{a.description}</p>
                  </div>

                  <div className="flex-col flex gap-2 mt-10">
                    <Button
                      variant={"default"}
                      isLoading={publishItemMutation.isPending}
                      onClick={() => publishItemMutation.mutateAsync(a.id)}
                    >
                      {!publishItemMutation.isPending && (
                        <SendIcon className="h-4 w-4" />
                      )}
                      Publish
                    </Button>
                    <Button
                      variant={"outline"}
                      isLoading={sentItBackMutation.isPending}
                      onClick={() => sentItBackMutation.mutateAsync(a.id)}
                    >
                      {!sentItBackMutation.isPending && (
                        <CornerLeftDown className="h-4 w-4" />
                      )}
                      Send back
                    </Button>
                    <Button
                      variant={"outline"}
                      isLoading={deleteItemMutation.isPending}
                      onClick={() => deleteItemMutation.mutateAsync(a.id)}
                    >
                      {!deleteItemMutation.isPending && (
                        <TrashIcon className="h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 border bg-neutral-50 p-4 rounded w-full">
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
            ))
          ))}
      </Suspense>
    </div>
  );
}

export default AssetListing;
