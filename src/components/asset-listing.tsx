import { useApi } from "@/hooks";
import { format } from "date-fns";
import { Search } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

function AssetListing() {
  const { auctionsApi } = useApi();

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
   if (isPending || !isSuccess) return <p>Loading...</p>;
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
            <Alert className="m-4 rounded w-fit" variant={"destructive"}>
              <AlertTitle>No items to view</AlertTitle>
              <AlertDescription>
                Add some new assets to see here or change your search value
              </AlertDescription>
            </Alert>
          ) : (
            filteredItems.map((a) => (
              <div
                key={a.id}
                className="border border-gray-300 bg-background p-4 m-4 rounded  hover:shadow gap-4 grid"
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
