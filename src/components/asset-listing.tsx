import { useApi } from "@/hooks";
import { format } from "date-fns";
import { Button } from "./ui/button";

function AssetListing() {
  const { auctionsApi } = useApi();

  const { data, isPending, isError, isSuccess } = auctionsApi.list();

  if (isPending || !isSuccess) return <p>Loading...</p>;
  if (isError) {
    return <p>Error: {isError}</p>;
  }
  return (
    <div>
      {data &&
        data.map((a) => (
          <div
            key={a.id}
            className="border border-gray-300 bg-background p-4 m-4 rounded  hover:shadow gap-4 grid"
          >
            <div className="flex flex-1 justify-between ">
              <div className="space-y-2">
                <p>{a.title}</p>

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
                <p className="text-neutral-600 text-sm">{a.description}</p>
              </div>

              <div className="flex-col flex gap-2 mt-10">
                <Button variant={"default"}>Push for auction</Button>
                <Button variant={"outline"}>Send back</Button>
                <Button variant={"outline"}>Delete</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-2 border bg-neutral-50 p-4 rounded">
              <div className="text-xs text-gray-500 ">
                Case Number:
                <div className="text-xs text-gray-800 font-semibold ">
                  {a.case_number}
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Auction Date:
                <div className="text-xs text-gray-800 font-semibold">
                  {a.start_time ? format(a.start_time, "PPP") : "N/A"}
                </div>
              </div>

              <div className="text-xs text-gray-500 ">
                EMD Amount:
                <div className="text-xs text-gray-800 font-semibold ">
                  {a.emd_amount ? Number(a.emd_amount).toLocaleString() : "N/A"}
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
        ))}
    </div>
  );
}

export default AssetListing;
