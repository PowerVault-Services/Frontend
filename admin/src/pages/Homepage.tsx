import SearchBox from "../components/SearchBox";
import PlantStatusCard from "../components/cards/PlantStatusCard";
import AlarmCard from "../components/cards/AlarmCard";
import { useEffect, useState } from "react";
import TextInputFilter from "../components/TextInputFilter";
import SelectFilter from "../components/SelectFilter";
import DataTable, { type Column } from "../components/table/DataTable";
import Pagination from "../components/table/Pagination";

import {
  getHomepageSummary,
  getHomepagePlants
} from "../services/homepage.api";

interface Plant {
  id: number;
  siteId: number;
  plantCode: string;
  plantName: string;
  address: string;
  status: string;
  gridConnectionDate: string | null;
  totalStringCapacityKWp: number;
  optimizerQuantity: number | null;
  currentPowerKW: number;
  specificEnergyKWhPerKWp: number;
  yieldTodayKWh: number;
  totalYieldKWh: number | null;
  performanceRatio: number | null;
  lastUpdatedAt: string;
}

export default function Homepage() {

  // =========================
  // Filters (แก้ไขใหม่)
  // =========================
  const [plantName, setPlantName] = useState("");
  const [country, setCountry] = useState("");
  const [deviceSN, setDeviceSN] = useState("");
  const [deviceType, setDeviceType] = useState("");

  // =========================
  // Data
  // =========================
  const [plants, setPlants] = useState<Plant[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // =========================
  // Pagination
  // =========================
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const buildQuery = () => {
    return [plantName, country, deviceType, deviceSN]
      .filter(Boolean)
      .join(" ");
  };

  // =========================
  // Load Summary (โหลดครั้งเดียว)
  // =========================
  useEffect(() => {
    async function loadSummary() {
      try {
        const summaryRes = await getHomepageSummary();
        setSummary(summaryRes);
      } catch (err) {
        console.error("โหลด summary ไม่สำเร็จ", err);
      }
    }
    loadSummary();
  }, []);

  // =========================
  // Load Plants (รองรับ filter)
  // =========================
  async function loadPlants() {
    try {
      setLoading(true);

      const q = buildQuery();

      const plantRes = await getHomepagePlants(page, pageSize, q);

      setPlants(
        plantRes.list.map((item: Plant) => ({
          ...item,
          id: item.siteId,
        }))
      );

      setTotalItems(plantRes.pagination.total);
      setTotalPages(plantRes.pagination.totalPages);

    } catch (err) {
      console.error("โหลด plants ไม่สำเร็จ", err);
    } finally {
      setLoading(false);
    }
  }

  // โหลดเมื่อ page เปลี่ยน
  useEffect(() => {
    loadPlants();
  }, [page]);

  // =========================
  // Table Columns
  // =========================
  const columns: Column<Plant>[] = [

    {
      id: "status",
      key: "status",
      label: "Status",
      render: (value) => {
        const color =
          value === "Normal"
            ? "bg-green-500"
            : value === "Faulty"
              ? "bg-red-500"
              : "bg-gray-400";

        return (
          <span className={`w-3 h-3 rounded-full ${color} inline-block`} />
        );
      },
      align: "center",
    },

    {
      id: "plantName",
      key: "plantName",
      label: "Plant Name",
    },

    {
      id: "address",
      key: "address",
      label: "Address",
      render: (value) => formatAddress(value),
    },

    {
      id: "gridConnectionDate",
      key: "gridConnectionDate",
      label: "Grid Connection Date",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "-"
    },

    {
      id: "capacity",
      key: "totalStringCapacityKWp",
      label: "Total String Capacity (kWp)"
    },

    {
      id: "optimizerQuantity",
      key: "optimizerQuantity",
      label: "Optimizer Quantity",
      render: (value) => value ?? "-"
    },

    {
      id: "currentPower",
      key: "currentPowerKW",
      label: "Current Power (kW)"
    },

    {
      id: "specificEnergy",
      key: "specificEnergyKWhPerKWp",
      label: "Specific Energy (kWh/kWp)"
    },

    {
      id: "yieldToday",
      key: "yieldTodayKWh",
      label: "Yield Today (kWh)"
    },

    {
      id: "totalYield",
      key: "totalYieldKWh",
      label: "Total Yield (kWh)",
      render: (value) => value ?? "-"
    },

    {
      id: "performanceRatio",
      key: "performanceRatio",
      label: "Performance Ratio (%)",
      render: (value) => value ?? "-"
    }

  ];

  function formatAddress(address: string) {
    if (!address) return "-";

    // ดึงจังหวัด (คำว่า "จ.")
    const provinceMatch = address.match(/จ\.?\s*([^\s]+)/);
    const province = provinceMatch ? provinceMatch[1] : "";

    // ดึงรหัสไปรษณีย์
    const zipMatch = address.match(/\d{5}/);
    const zip = zipMatch ? zipMatch[0] : "";

    return `${address.replace(/จ\.[^\s]+/, "").trim()}, ${province} ${zip}`;
  }

  return (
    <div className="w-auto h-auto">

      {/* Top Cards */}
      <div className="bg-white grid grid-cols-1 lg:grid-cols-3 gap-10 px-[50px] py-[30px] rounded-2xl items-start">

        <PlantStatusCard data={summary?.plantStatus} />

        <AlarmCard data={summary?.activeAlarms} />

        <div className="max-w-[400px]">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Notification Alarms
            </h3>
          </div>

          <div className="space-y-3">
            {summary?.notificationAlarms?.slice(0, 4).map((alarm: any, i: number) => (
              <div
                key={i}
                className="min-h-[62px] w-auto border border-[#DEE2E6] px-3.5 py-1.5 rounded-lg"
              >
                <div className="flex justify-between text-sm font-regular">
                  <span>{alarm.plantName}</span>
                  <span className="text-gray-400">
                    {new Date(alarm.occurredAt).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-black">
                  {alarm.detail} ({alarm.inverterName})
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Search */}
      <div className="mt-6">
        <SearchBox
          onSearch={() => {
            setPage(1);
            loadPlants();
          }}
          onReset={() => {
            setPlantName("");
            setCountry("");
            setDeviceSN("");
            setDeviceType("");
            setPage(1);
            loadPlants();
          }}
        >
          <div className="grid grid-cols-4 gap-4">

            <TextInputFilter
              label="Plant Name"
              value={plantName}
              onChange={setPlantName}
            />

            <TextInputFilter
              label="Country/Region"
              value={country}
              onChange={setCountry}
            />

            <SelectFilter
              label="Device type"
              placeholder="All"
              value={deviceType}
              onChange={setDeviceType}
              options={[
                { label: "All", value: "" },
                { label: "Inverter", value: "inverter" },
                { label: "Optimizer", value: "optimizer" },
              ]}
            />

            <TextInputFilter
              label="Device SN"
              value={deviceSN}
              onChange={setDeviceSN}
            />

          </div>
        </SearchBox>
      </div>

      {/* Data Table */}
      <div className="mt-6">
        <DataTable<Plant>
          columns={columns}
          data={plants}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-6 text-sm text-gray-500">
        <span>
          {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, totalItems)} of {totalItems} items
        </span>

        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </div>

    </div>
  );
}