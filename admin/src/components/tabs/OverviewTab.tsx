import { useEffect, useState } from "react";
import EnergyFlowCard from "../cards/EnergyFlowCard";
import EnergyManagementCard from "../../components/EnergyManagementCard";
import InverterCard from "../cards/InverterCard";
import MainMeterCard from "../cards/MainMeter";
import MainBatteryCard from "../cards/MainBattery";
import MainSolar from "../cards/MainSolar";
import MainWeather from "../cards/MainWeather";


/* ================= Types ================= */
type Inverter = {
  id: string;
  name: string;
  power: number;
  status: "Connect" | "Disconnect";
  alarm: string;
  model: string;
};

type MainMeter = {
  id: string;
  voltage: number;
  current: number;
  power: number;
  status: "Connect" | "Disconnect";
};

type MainBattery = {
  id: string;
  soc: number;
  temp: number;
  powerstatus: "Normal" | "Warning";
  status: "Connect" | "Disconnect";
};

type MainSolar = {
  id: string;
  irradiance: number;
  Current: number;
  powerstatus: "Online" | "Offline";
  status: "Connect" | "Disconnect";
};

type MainWeather = {
  id: string;
  wind: number;
  temp: number;
  powerstatus: "Normal" | "Warning";
  status: "Connect" | "Disconnect";
};

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

  /* ================= Mock Data ================= */
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

  const mainMeters: MainMeter[] = [
    {
      id: "1",
      voltage: 220,
      current: 5.5,
      power: 12.1,
      status: "Connect",
    },
  ];

  const mainBatteries: MainBattery[] = [
    {
      id: "1",
      soc: 85,
      temp: 25,
      powerstatus: "Normal",
      status: "Disconnect",
    },
  ];

  const mainSolars: MainSolar[] = [
    {
      id: "1",
      irradiance: 750,
      Current: 4.2,
      powerstatus: "Online",
      status: "Connect",
    },
  ];

  const mainWeathers: MainWeather[] = [
    {
      id: "1",
      wind: 3.5,
      temp: 30,
      powerstatus: "Normal",
      status: "Connect",
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

      {/* ===== Inverters ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[18px]">
        {inverters.map(inv => (
          <InverterCard key={inv.id} inverter={inv} />
        ))}
      </div>

      {/* ===== Main Meters ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[18px]">
        {mainMeters.map(meter => (
          <MainMeterCard key={meter.id} mainMeter={meter} />
        ))}
        {mainBatteries.map(battery => (
          <MainBatteryCard key={battery.id} mainBattery={battery} />
        ))}
          {mainSolars.map(solar => (
            <MainSolar key={solar.id} mainSolar={solar} />
          ))}
          {mainWeathers.map(weather => (
            <MainWeather key={weather.id} mainWeather={weather} />
          ))}
      </div>
    </div>
  );
}
