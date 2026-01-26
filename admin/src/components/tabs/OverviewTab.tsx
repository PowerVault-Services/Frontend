import { useEffect, useState, useRef } from "react";
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

  // Ref สำหรับ Container ของ Inverter
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/overview")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

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

  /* ================= Mock Data ================= */
  const inverters: Inverter[] = [
    { id: "1", name: "Inverter 1", power: 12.5, status: "Connect", alarm: "-", model: "Huawei SUN2000" },
    { id: "2", name: "Inverter 2", power: 8.2, status: "Disconnect", alarm: "Grid Lost", model: "Growatt MAX" },
    { id: "3", name: "Inverter 3", power: 8.2, status: "Disconnect", alarm: "Grid Lost", model: "Growatt MAX" },
    { id: "4", name: "Inverter 4", power: 88.2, status: "Disconnect", alarm: "Grid Lost", model: "Growatt MAX" },
    { id: "5", name: "Inverter 5", power: 100.0, status: "Connect", alarm: "-", model: "Huawei SUN2000" }, 
    { id: "6", name: "Inverter 6", power: 5.5, status: "Connect", alarm: "-", model: "Huawei SUN2000" }, 
  ];

  const mainMeters: MainMeter[] = [
    { id: "1", voltage: 220, current: 5.5, power: 12.1, status: "Connect" },
  ];

  const mainBatteries: MainBattery[] = [
    { id: "1", soc: 85, temp: 25, powerstatus: "Normal", status: "Disconnect" },
  ];

  const mainSolars: MainSolar[] = [
    { id: "1", irradiance: 750, Current: 4.2, powerstatus: "Online", status: "Connect" },
  ];

  const mainWeathers: MainWeather[] = [
    { id: "1", wind: 3.5, temp: 30, powerstatus: "Normal", status: "Connect" },
  ];

  // เช็คจำนวนรายการว่าเกิน 4 หรือไม่
  const isScrollable = inverters.length > 4;

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
              // ไม่ต้องคำนวณ Width ที่นี่แล้ว เพราะ Parent (Grid) จัดการให้
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