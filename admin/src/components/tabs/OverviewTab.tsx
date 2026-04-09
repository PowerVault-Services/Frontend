import { useEffect, useState, useRef } from "react";

import EnergyFlowCard from "../cards/EnergyFlowCard";
import EnergyManagementCard from "../../components/EnergyManagementCard";
import InverterCard from "../cards/InverterCard";
import MainMeterCard from "../cards/MainMeter";
import MainBatteryCard from "../cards/MainBattery";
import MainSolar from "../cards/MainSolar";
import MainWeather from "../cards/MainWeather";

import ArrowLeft from "../../assets/icons/Arrow Left.svg";
import ArrowRight from "../../assets/icons/Arrow Right.svg";

import {
  getSiteOverview,
  getEnergyManagement,
  getEnergyFlow,
  getSummaryCards,
} from "../../services/monitoring.api";

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

type EnergyFlowData = {
  pv: number;
  grid: number;
  battery: number;
  load: number;
};

type Inverter = {
  id: string;
  name: string;
  power: number;
  status: "Connect" | "Disconnect";
  alarm: string;
  model: string;
};

interface OverviewTabProps {
  plantId?: number;
}

/* ================= Helper ================= */
const formatDateByView = (view: string) => {
  const d = new Date();
  if (view === "day") return d.toISOString().split("T")[0];
  if (view === "month") return d.toISOString().slice(0, 7);
  if (view === "year") return d.getFullYear().toString();
  return "";
};



/* ================= Skeleton Card ================= */
function InverterSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3 w-24 bg-gray-200 rounded-full" />
          <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
        </div>
        {/* status badge */}
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Rows */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between">
          <div className="h-2.5 w-20 bg-gray-100 rounded-full" />
          <div className="h-2.5 w-14 bg-gray-200 rounded-full" />
        </div>
        <div className="flex justify-between">
          <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
          <div className="h-2.5 w-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex justify-between">
          <div className="h-2.5 w-12 bg-gray-100 rounded-full" />
          <div className="h-2.5 w-12 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function OverviewTab({ plantId }: OverviewTabProps) {
  /* ================= State ================= */
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [realtime, setRealtime] = useState<any>(null);

  const [view, setView] = useState<"day" | "month" | "year" | "lifetime">("day");
  const [date, setDate] = useState(formatDateByView("day"));
  const [energyData, setEnergyData] = useState<any>(null);

  const [flowData, setFlowData] = useState<EnergyFlowData>({
    pv: 0,
    grid: 0,
    battery: 0,
    load: 0,
  });

  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /* ================= Sync date ================= */
  useEffect(() => {
    setDate(formatDateByView(view));
  }, [view]);

  /* ================= Fetch API ================= */
  useEffect(() => {
    if (!plantId) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [overview, energy, flow, summary] = await Promise.all([
          getSiteOverview(plantId),
          getEnergyManagement(plantId, view, date),
          getEnergyFlow(plantId),
          getSummaryCards(plantId),
        ]);

        console.log("✅ plantId:", plantId);
        console.log("✅ flow raw:", flow);
        console.log("🔌 RAW energyFlow:", JSON.stringify(flow?.energyFlow, null, 2));

        setData(overview);
        setEnergyData(energy);

        // เพิ่ม type guard ก่อน setFlowData
        const ef = flow?.energyFlow || {};

        const PV_THRESHOLD = 0.05;

        setFlowData({
          // pv ไม่มี signed — ใช้ powerKw ตรงๆ + threshold กัน noise
          pv: (ef.pv?.powerKw ?? 0) >= PV_THRESHOLD ? (ef.pv?.powerKw ?? 0) : 0,

          // grid/battery — ใช้ signedPowerKw ถ้ามี, fallback powerKw พร้อม direction
          grid: ef.grid?.signedPowerKw !== null && ef.grid?.signedPowerKw !== undefined
            ? ef.grid.signedPowerKw
            : ef.grid?.direction === "export" ? -(ef.grid?.powerKw ?? 0)
              : ef.grid?.direction === "import" ? (ef.grid?.powerKw ?? 0)
                : 0,

          battery: ef.battery?.signedPowerKw !== null && ef.battery?.signedPowerKw !== undefined
            ? ef.battery.signedPowerKw
            : ef.battery?.direction === "discharge" ? -(ef.battery?.powerKw ?? 0)
              : ef.battery?.direction === "charge" ? (ef.battery?.powerKw ?? 0)
                : 0,

          load: ef.load?.powerKw ?? 0,
        });

        const rawSummary = summary?.summaryCards;
        const summaryObj = Array.isArray(rawSummary)
          ? {
            meter: rawSummary.find((i: any) => i.type === "meter"),
            battery: rawSummary.find((i: any) => i.type === "battery"),
            solar: rawSummary.find((i: any) => i.type === "solar"),
          }
          : rawSummary;

        setRealtime({
          summaryCards: summaryObj,
          supportingData: summary?.supportingData,
        });

      } catch (err: any) {
        console.error("❌ API error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [plantId, view, date]);

  /* ================= Scroll ================= */
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = scrollContainerRef.current.clientWidth;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  /* ================= Mapping ================= */
  const inverters: Inverter[] =
    data?.inverters?.map((inv: any) => ({
      id: String(inv.id),
      name: inv.name,
      model: inv.model,
      power: inv.activePower ?? 0,
      status: inv.status === "Normal" ? "Connect" : "Disconnect",
      alarm: inv.status === "Fault" ? "Fault" : "-",
    })) || [];

  const isScrollable = inverters.length > 4;

  console.log("🌱 render plantId:", plantId);

  /* ================= UI ================= */
  return (
    <div className="flex flex-col gap-[18px]">

      {/* ===== Top Section ===== */}
      <div className="flex gap-[18px] w-full">
        <EnergyFlowCard
          pv={flowData.pv}
          grid={flowData.grid}
          battery={flowData.battery}
          load={flowData.load}
        />
        <EnergyManagementCard
          data={energyData}
          view={view}
          date={date}
          onChangeView={setView}
          onChangeDate={setDate}
        />
      </div>

      {/* ===== Inverters ===== */}
      <div className="relative group">
        {isScrollable && !loading && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 bg-green-100 rounded-[10px] flex items-center justify-center shadow-md"
          >
            <img src={ArrowLeft} alt="left" />
          </button>
        )}

        {/* ✅ Skeleton while loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[18px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <InverterSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className={
              isScrollable
                ? "grid grid-flow-col gap-[18px] overflow-x-auto pb-2 no-scrollbar auto-cols-[100%] md:auto-cols-[calc(25%-13.5px)]"
                : "grid grid-cols-1 md:grid-cols-4 gap-[18px]"
            }
          >
            {inverters.map((inv) => (
              <div key={inv.id}>
                <InverterCard inverter={inv} />
              </div>
            ))}
          </div>
        )}

        {isScrollable && !loading && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-8 h-8 bg-green-100 rounded-[10px] flex items-center justify-center shadow-md"
          >
            <img src={ArrowRight} alt="right" />
          </button>
        )}
      </div>

      {/* ===== Bottom Section ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[18px]">
        <MainMeterCard data={realtime?.summaryCards?.meter} />
        <MainBatteryCard data={realtime?.summaryCards?.battery} />
        <MainSolar data={realtime?.summaryCards?.solar} />
        <MainWeather data={realtime?.supportingData?.weather} />
      </div>

    </div>
  );
}