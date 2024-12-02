import { useStore } from "@/hooks";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { CheckCheckIcon, Terminal, Trash2Icon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

export const Inbox = () => {
  const { user } = useStore(useShallow((s) => ({ user: s.user })));
  const getUnApprovedAuctions = async () => {
    const { data, error } = await supabase
      .from("auctions")
      .select("id, title, description, status, images, case_number")
      .eq("org_id", user?.org_id);
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const { data, isPending, error, isSuccess, isError } = useQuery({
    queryKey: ["auctions", user?.org_id],
    queryFn: getUnApprovedAuctions,
  });

  if (isPending || !isSuccess) return <p>Loading...</p>;

  if (isError) {
    return <p>Error: {error}</p>;
  }
  return (
    <div className="space-y-4 gap-4 p-6 justify-center flex flex-col w-screen">
      <h1 className="text-2xl font-bold">Inbox</h1>

      {data.length === 0 && <p>No Unapproved Auctions</p>}
      <div className="w-full lg:w-[calc(100%-16rem)] space-y-4">
        {data.map((auction) => {
          return (
            <div key={auction.id}>
              <Alert className="flex justify-between">
                <div className="flex">
                  <img
                    src={auction.images[0]}
                    alt="image"
                    className="rounded w-36 h-24 aspect-auto mr-2 object-fill"
                  />
                  <div>
                    <Terminal className="h-4 w-4 my-2" />
                    <AlertTitle>{auction.title}</AlertTitle>
                    <AlertDescription>{auction.description}</AlertDescription>
                    <div className="text-xs text-gray-500 py-2">
                      Submitted by: John Doe
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 self-end">
                  <Button variant={"outline"} size={"sm"}>
                    View
                  </Button>
                  <Button variant="destructive" size={"sm"}>
                    <Trash2Icon className="h-4 w-4" />
                    Delete
                  </Button>
                  <Button variant="default" size={"sm"}>
                    <CheckCheckIcon className="h-4 w-4" />
                    Publish
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
