import { useEffect, useState } from "react";
import EnergyFlowCard from "../cards/EnergyFlowCard";
import EnergyManagementCard from "../../components/EnergyManagementCard";

export default function OverviewTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/overview") // real api
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex gap-[18px]">
        <EnergyFlowCard pv={data?.pv || 0} grid={data?.grid || 0} battery={data?.battery || 0} load={data?.load || 0} />
        <div className="">
          <EnergyManagementCard />
        </div>
    </div>
  );
}
