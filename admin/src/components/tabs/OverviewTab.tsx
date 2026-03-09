import { useEffect, useState, useRef } from "react";

import api from "../../services/api";

import EnergyFlowCard from "../cards/EnergyFlowCard";
import EnergyManagementCard from "../../components/EnergyManagementCard";
import InverterCard from "../cards/InverterCard";
import MainMeterCard from "../cards/MainMeter";
import MainBatteryCard from "../cards/MainBattery";
import MainSolar from "../cards/MainSolar";
import MainWeather from "../cards/MainWeather";

// Import Icons
import ArrowLeft from "../../assets/icons/Arrow Left.svg";
import ArrowRight from "../../assets/icons/Arrow Right.svg";



/* ================= Types ================= */
type OverviewResponse = {
  inverters?: {
    id: number;
    name: string;
    model: string;
    activePower?: number;
    status: string;
  }[];
};

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

interface OverviewTabProps {
  plantId?: number; // รับ plantId มาจากหน้า HomeMonitor
}

export default function OverviewTab({ plantId }: OverviewTabProps) {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Ref สำหรับ Container ของ Inverter
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!plantId) return;

    const fetchOverview = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/monitoring/sites/${plantId}/overview`
        );

        // response.data = { data: {...} }
        setData(response.data.data);
      } catch (err) {
        console.error("ไม่สามารถดึงข้อมูล Overview ได้:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [plantId]);



  /* ================= Logic การเลื่อน (Scroll) ================= */
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      // เลื่อนทีละประมาณความกว้างของ Container หารด้วย 4 (หรือ 1 เพื่อเลื่อนทั้งหน้า)
      const scrollAmount = current.clientWidth / 1;

      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  const inverters: Inverter[] =
    data?.inverters?.map((inv: any) => ({
      id: String(inv.id),
      name: inv.name,
      model: inv.model,
      power: inv.activePower ?? 0,
      status: inv.status === "Normal" ? "Connect" : "Disconnect",
      alarm: inv.status === "Fault" ? "Fault" : "-",
    })) || [];



  // TODO: waiting API support
  const mainMeters: MainMeter[] = [];
  const mainBatteries: MainBattery[] = [];
  const mainSolars: MainSolar[] = [];
  const mainWeathers: MainWeather[] = [];


  const isScrollable = inverters.length > 4;

  return (
    <div className="flex flex-col gap-[18px]">
      {/* ===== Top Section ===== */}
      <div className="flex gap-[18px] w-full">
        <EnergyFlowCard
          pv={0}
          grid={0}
          battery={0}
          load={0}
        />

        <EnergyManagementCard />
      </div>

      {/* ===== Inverters Section ===== */}
      <div className="relative group">

        {/* ปุ่มซ้าย */}
        {isScrollable && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 
                       w-8 h-8 bg-green-100 rounded-[10px]
                       flex items-center justify-center shadow-md hover:bg-[#C8E6C9] transition-colors"
          >
            <img src={ArrowLeft} alt="arrowleft" />
          </button>
        )}

        {/* Container: 
            - ใช้ grid-flow-col + auto-cols สำหรับโหมด Scroll 
            - ใช้ grid-cols-4 ปกติ สำหรับโหมด Grid
            - คำนวณ auto-cols ให้เท่ากับความกว้างของ column ใน grid ปกติ: calc(25% - 13.5px)
        */}
        <div
          ref={scrollContainerRef}
          className={
            isScrollable
              ? "grid grid-flow-col gap-[18px] overflow-x-auto pb-2 scroll-smooth no-scrollbar auto-cols-[100%] md:auto-cols-[calc(25%-13.5px)]"
              : "grid grid-cols-1 md:grid-cols-4 gap-[18px]"
          }
          style={isScrollable ? { scrollbarWidth: "none", msOverflowStyle: "none" } : {}}
        >
          <style>{`
             .no-scrollbar::-webkit-scrollbar { display: none; }
           `}</style>

          {inverters.map((inv) => (
            <div
              key={inv.id}
              className="w-full"
            >
              <InverterCard inverter={inv} />
            </div>
          ))}
        </div>

        {/* ปุ่มขวา */}
        {isScrollable && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 
                       w-8 h-8 bg-green-100 rounded-[10px]
                       flex items-center justify-center shadow-md hover:bg-[#C8E6C9] transition-colors"
          >
            <img src={ArrowRight} alt="arrowright" />
          </button>
        )}
      </div>

      {/* ===== Main Meters & Others ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[18px]">
        {mainMeters.map((meter) => (
          <MainMeterCard key={meter.id} mainMeter={meter} />
        ))}
        {mainBatteries.map((battery) => (
          <MainBatteryCard key={battery.id} mainBattery={battery} />
        ))}
        {mainSolars.map((solar) => (
          <MainSolar key={solar.id} mainSolar={solar} />
        ))}
        {mainWeathers.map((weather) => (
          <MainWeather key={weather.id} mainWeather={weather} />
        ))}
      </div>
    </div>
  );
}