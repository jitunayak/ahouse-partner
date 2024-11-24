import { CheckCheckIcon, Terminal, Trash2Icon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Button } from "./ui/button";

export const Inbox = () => {
  return (
    <div className="space-y-4 gap-4 p-6 justify-center flex flex-col w-screen">
      <h1 className="text-2xl font-bold">Inbox</h1>

      <div className="w-[calc(100%-16rem)]">
        <Alert className="flex justify-between">
          <div>
            <Terminal className="h-4 w-4 my-2" />
            <AlertTitle>Auction Name</AlertTitle>
            <AlertDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </AlertDescription>
            <div className="text-xs text-gray-500 py-2">
              Submitted by: John Doe
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
              Approve
            </Button>
          </div>
        </Alert>
      </div>
    </div>
  );
};
