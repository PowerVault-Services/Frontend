import { useEffect, useState, useRef } from "react";
import api from "../../services/api";

import EnergyFlowCard from "../cards/EnergyFlowCard";
import EnergyManagementCard from "../../components/EnergyManagementCard";
import InverterCard from "../cards/InverterCard";
import MainMeterCard from "../cards/MainMeter";
import MainBatteryCard from "../cards/MainBattery";
import MainSolar from "../cards/MainSolar";
import MainWeather from "../cards/MainWeather";

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
        const [overviewRes, realtimeRes, energyRes] = await Promise.all([
          api.get(`/monitoring/sites/${plantId}/overview`),
          api.get(`/monitoring/sites/${plantId}/home-realtime`),
          api.get(`/monitoring/sites/${plantId}/energy-management`, {
            params: { view, date },
          }),
        ]);

        /* ===== Overview ===== */
        setData(overviewRes.data?.data);

        /* ===== Energy ===== */
        setEnergyData(energyRes.data?.data);

        /* ===== Realtime ===== */
        const rt = realtimeRes.data?.data || {};
        setRealtime(rt);

        /* ===== Flow ===== */
        const flow = rt.energyFlow || {};

        setFlowData({
          pv: flow.pv?.powerKw || 0,
          grid: flow.grid?.signedPowerKw ?? flow.grid?.powerKw ?? 0,
          battery: flow.battery?.signedPowerKw ?? flow.battery?.powerKw ?? 0,
          load: flow.load?.powerKw || 0,
        });

      } catch (err: any) {
        console.error("❌ API error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [plantId, view, date]);

  /* ================= Refresh ================= */
  const handleRefresh = async () => {
    if (!plantId) return;

    try {
      setLoading(true);

      await api.post(`/monitoring/sites/${plantId}/refresh`, {
        mode: "full",
      });

      const [overviewRes, realtimeRes] = await Promise.all([
        api.get(`/monitoring/sites/${plantId}/overview`),
        api.get(`/monitoring/sites/${plantId}/home-realtime?refresh=full`),
      ]);

      setData(overviewRes.data?.data);

      const rt = realtimeRes.data?.data || {};
      setRealtime(rt);

      const flow = rt.energyFlow || {};

      setFlowData({
        pv: flow.pv?.powerKw || 0,
        grid: flow.grid?.signedPowerKw ?? flow.grid?.powerKw ?? 0,
        battery: flow.battery?.signedPowerKw ?? flow.battery?.powerKw ?? 0,
        load: flow.load?.powerKw || 0,
      });

    } catch (err) {
      console.error("❌ Refresh error:", err);
    } finally {
      setLoading(false);
    }
  };

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
        {isScrollable && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 bg-green-100 rounded-[10px] flex items-center justify-center shadow-md"
          >
            <img src={ArrowLeft} alt="left" />
          </button>
        )}

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

        {isScrollable && (
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