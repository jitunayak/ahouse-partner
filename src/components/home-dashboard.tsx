import { useApi } from "@/hooks";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon, FileDownIcon } from "lucide-react";
import CreateAsset from "./create-asset";
import { Button } from "./ui/button";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[180px] hover:shadow-sm space-y-4 rounded-md border-neutral-200 dark:border-neutral-700 p-4 border bg-background">
      {children}
    </div>
  );
}
function CardValue({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-3xl  leading-none tracking-tight">{children}</div>
  );
}
function HomeDashboard() {
  const { auctionsApi } = useApi();
  const {
    total: totalAssets,
    pending: totalPendingAssets,
    vehicle: totalVehicles,
    land: totalLand,
    gold: totalGold,
    realEstate: totalRealEstate,
  } = auctionsApi.totalCounts();

  return (
    <div className="p-10">
      <div className="text-3xl font-bold mb-10">Dashboard</div>
      <div className="text-xl font-semibold mt-10 mb-4">Statistics</div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card>
          <div className="text-sm ">Total Assets</div>
          <div className="text-3xl  text-green-600">{totalAssets}</div>
        </Card>
        <Link to="/home/inbox">
          <Card>
            <div className="flex flex-row gap-2">
              <div className="text-sm ">Pending Assets</div>
              <ArrowUpRightIcon className="h-4 w-4 hover:text-primary hover:scale-110" />
            </div>
            <div className="text-3xl text-red-400">{totalPendingAssets}</div>
          </Card>
        </Link>
      </div>

      <div className="text-xl font-semibold mt-10 mb-4">Quick Actions</div>
      <div className="flex flex-row flex-wrap gap-2">
        <CreateAsset />
        <Link to="/home/inbox">
          <Button variant={"outline"} className="text-primary">
            View Pending <ArrowUpRightIcon className="h-4 w-4" />
          </Button>
        </Link>
        <Button variant={"outline"} className="text-primary" disabled>
          Generate Report <FileDownIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-xl font-semibold mt-10 mb-4">Upcoming Auctions</div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card>
          <div className="text-sm ">Vehicles</div>
          <CardValue>{totalVehicles ? totalVehicles : 0}</CardValue>
        </Card>

        <Card>
          <div className="text-sm ">Land</div>
          <CardValue>{totalLand ? totalLand : 0}</CardValue>
        </Card>

        <Card>
          <div className="text-sm ">Gold</div>
          <CardValue>{totalGold ? totalGold : 0}</CardValue>
        </Card>

        <Card>
          <div className="text-sm ">Real Estate</div>
          <CardValue>{totalRealEstate ? totalRealEstate : 0}</CardValue>
        </Card>
      </div>
    </div>
  );
}

export default HomeDashboard;
