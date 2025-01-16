import { useApi, useStore } from "@/hooks";
import { queryClient } from "@/lib";
import { QueryKeys } from "@/types/enum";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { CheckCheckIcon, CircleOff } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { ErrorFallback } from "./error-fallback";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import UpdateAuction from "./update-auction";

export const Inbox = () => {
  const { auctionsApi } = useApi();
  const { user } = useStore(useShallow((s) => ({ user: s.user })));

  const { data, isPending, error, isSuccess, isError } =
    auctionsApi.pendingItems();

  const handleApprove = useMutation({
    mutationFn: async (id: string) => {
      await auctionsApi.readyForListing(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "submitted"],
      });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.AUCTIONS, user?.org_id, "created"],
      });
    },
  });

  if (isPending || !isSuccess) return <ErrorFallback type="loading" />;

  if (isError) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="space-y-4 gap-4 p-6 justify-center flex flex-col w-full">
      <h1 className="text-2xl font-bold">Pending Assets</h1>

      {data.length === 0 && <p>No Unapproved Auctions</p>}
      <div className="w-full space-y-2 ">
        {data.map((auction) => {
          return (
            <div key={auction.id}>
              <Alert className="flex justify-between">
                <div className="flex flex-col md:flex-row">
                  <img
                    src={
                      auction.images[0].startsWith("http")
                        ? auction.images[0]
                        : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/` +
                          auction.images[0]
                    }
                    alt="image"
                    className="rounded w-36 h-34 aspect-auto mr-4 object-fill"
                  />
                  <div>
                    <AlertTitle>{auction.title}</AlertTitle>
                    <AlertDescription className="text-neutral-500">
                      {auction.description}
                    </AlertDescription>
                    <div className="text-xs text-gray-500 mt-4">
                      Auction Date:
                      <div className="text-xs text-gray-800 font-semibold">
                        {auction.start_time
                          ? format(auction.start_time, "PPP")
                          : "N/A"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="text-xs text-gray-500 ">
                        EMD Amount:
                        <div className="text-xs text-gray-800 font-semibold ">
                          {auction.emd_amount
                            ? Number(auction.emd_amount).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Asset Value:{" "}
                        <div className="text-xs text-gray-800 font-semibold ">
                          {auction.asset_value
                            ? Number(auction.asset_value).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 self-end flex-col lg:flex-row">
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className=" text-orange-600 hover:bg-orange-50"
                  >
                    <CircleOff className="scale-90" />
                    Reject
                  </Button>
                  <UpdateAuction
                    id={auction.id}
                    title={auction.title}
                    emdAmount={auction.emd_amount}
                    assetValue={auction.asset_value}
                    auctionDate={auction.start_time}
                  />

                  <Button
                    variant="outline"
                    size={"sm"}
                    onClick={() => handleApprove.mutateAsync(auction.id)}
                    className="text-primary"
                    disabled={
                      !(
                        auction.asset_value &&
                        auction.emd_amount &&
                        auction.start_time
                      )
                    }
                  >
                    <CheckCheckIcon className="h-4 w-4" />
                    Send for approval
                  </Button>
                </div>
              </Alert>
            </div>
          );
        })}
      </div>
    </div>
  );
};
