import { useEffect, useState } from "react";
import EnergyFlowCard from "../cards/EnergyFlowCard";
import EnergyManagementCard from "../../components/EnergyManagementCard";
import InverterCard from "../cards/InverterCard";

export default function OverviewTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/overview")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  // mock inverter data (รอ api จริงได้)
type Inverter = {
  id: string;
  name: string;
  power: number;
  status: "Connect" | "Disconnect";
  alarm: string;
  model: string;
};

const inverters: Inverter[] = [
  {
    id: "1",
    name: "Inverter 1",
    power: 12.5,
    status: "Connect",
    alarm: "-",
    model: "Huawei SUN2000",
  },
  {
    id: "2",
    name: "Inverter 2",
    power: 8.2,
    status: "Disconnect",
    alarm: "Grid Lost",
    model: "Growatt MAX",
  },
  {
    id: "3",
    name: "Inverter 3",
    power: 8.2,
    status: "Disconnect",
    alarm: "Grid Lost",
    model: "Growatt MAX",
  },
  {
    id: "4",
    name: "Inverter 4",
    power: 8.2,
    status: "Disconnect",
    alarm: "Grid Lost",
    model: "Growatt MAX",
  },
];


  return (
    <div className="flex flex-col gap-[18px]">
      {/* ===== Top Section ===== */}
      <div className="flex gap-[18px]">
        <EnergyFlowCard
          pv={data?.pv || 0}
          grid={data?.grid || 0}
          battery={data?.battery || 0}
          load={data?.load || 0}
        />

        <EnergyManagementCard />
      </div>

      {/* ===== Bottom Section : Inverter ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[18px]">
        {inverters.map(inv => (
          <InverterCard key={inv.id} inverter={inv} />
        ))}
      </div>
    </div>
  );
}
