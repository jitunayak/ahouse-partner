import { useApi } from "@/hooks";
import { format } from "date-fns";
import { CheckCheckIcon, CircleOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import UpdateAuction from "./update-auction";

export const Inbox = () => {
  const { auctionsApi } = useApi();
  const { data, isPending, error, isSuccess, isError } =
    auctionsApi.pendingItems();

  if (isPending || !isSuccess) return <p>Loading...</p>;

  if (isError) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className="space-y-4 gap-4 p-6 justify-center flex flex-col w-screen">
      <h1 className="text-2xl font-bold">Pending Assets</h1>

      {data.length === 0 && <p>No Unapproved Auctions</p>}
      <div className="w-full lg:w-[calc(100%-16rem)] space-y-2 ">
        {data.map((auction) => {
          return (
            <div key={auction.id}>
              <Alert className="flex justify-between">
                <div className="flex">
                  <img
                    src={
                      `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/` +
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
                <div className="flex gap-2 self-end">
                  <Button
                    variant="ghost"
                    size={"sm"}
                    className=" text-orange-600 hover:bg-orange-50"
                  >
                    <CircleOff className="h-4 w-4" />
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
                    Ready for approval
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
