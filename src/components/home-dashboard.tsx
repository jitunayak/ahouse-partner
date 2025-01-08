import { useApi } from "@/hooks";
import { Link } from "@tanstack/react-router";
import { ArrowUpRightIcon } from "lucide-react";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[180px] hover:shadow-sm space-y-4 rounded-md border-neutral-200 p-4 border bg-background">
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

  const totalAssets = auctionsApi.totalAuctions();
  const totalVehicles = auctionsApi.totalVehicles();
  const totalLand = auctionsApi.totalLand();
  const totalGold = auctionsApi.totalGold();
  const totalRealEstate = auctionsApi.totalRealEstate();
  const pendingAssets = auctionsApi.totalPendingAssets();

  return (
    <div className="p-10">
      <div className="text-3xl font-bold mb-10">Dashboard</div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card>
          <div className="text-sm ">Total Assets</div>
          <div className="text-3xl  text-green-600">
            {totalAssets.data ? totalAssets.data : 0}
          </div>
        </Card>
        <Link to="/home/inbox">
          <Card>
            <div className="flex flex-row gap-2">
              <div className="text-sm ">Pending Assets</div>
              <ArrowUpRightIcon className="h-4 w-4 hover:text-primary" />
            </div>
            <div className="text-3xl text-red-400">
              {pendingAssets.data ? pendingAssets.data : 0}
            </div>
          </Card>
        </Link>
      </div>

      <div className="text-xl font-semibold mt-10 mb-4">Upcoming Auctions</div>
      <div className="flex flex-row flex-wrap gap-2">
        <Card>
          <div className="text-sm ">Vehicles</div>
          <CardValue>{totalVehicles.data ? totalVehicles.data : 0}</CardValue>
        </Card>

        <Card>
          <div className="text-sm ">Land</div>
          <CardValue>{totalLand.data ? totalLand.data : 0}</CardValue>
        </Card>

        <Card>
          <div className="text-sm ">Gold</div>
          <CardValue>{totalGold.data ? totalGold.data : 0}</CardValue>
        </Card>

        <Card>
          <div className="text-sm ">Real Estate</div>
          <CardValue>
            {totalRealEstate.data ? totalRealEstate.data : 0}
          </CardValue>
        </Card>
      </div>
    </div>
  );
}

export default HomeDashboard;
