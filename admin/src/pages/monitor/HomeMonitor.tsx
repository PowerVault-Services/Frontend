import { useEffect, useMemo, useState } from "react";
import { getMonitoringPlants } from "../../services/api";

import HomeIcon from "../../assets/icons/home.svg";
import TagNav from "../../components/TagNav";
import OverviewTab from "../../components/tabs/OverviewTab";

/* ================= Types ================= */
interface Plant {
  id: number;
  name: string;
}

/* ================= Component ================= */
export default function HomeMonitor() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  /* ================= Constants ================= */
  const tabs = [
    { id: "Overview", label: "Overview" },
    { id: "Alarm", label: "Alarm" },
    { id: "%PR", label: "%PR" },
    { id: "Report", label: "Report" },
  ];

  /* ================= Fetch Plants ================= */
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const res = await getMonitoringPlants();
        const data = Array.isArray(res?.data) ? res.data : [];

        setPlants(data);

        // เลือก plant แรกครั้งเดียว
        if (data.length > 0) {
          setSelectedPlant(data[0]);
        }
      } catch (err) {
        console.error("โหลด plant ไม่สำเร็จ:", err);
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  /* ================= Search ================= */
  const filteredPlants = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return plants;

    return plants.filter((p) =>
      p.name.toLowerCase().includes(keyword)
    );
  }, [plants, searchTerm]);

  /* ================= Keep selection valid ================= */
  useEffect(() => {
    if (
      selectedPlant &&
      !filteredPlants.find((p) => p.id === selectedPlant.id)
    ) {
      setSelectedPlant(filteredPlants[0] ?? null);
    }
  }, [filteredPlants, selectedPlant]);

  /* ================= Render Tab ================= */
  const renderTab = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <OverviewTab
            key={selectedPlant?.id}
            plantId={selectedPlant?.id}
          />
        );
      default:
        return <div>Coming soon</div>;
    }
  };

  /* ================= JSX ================= */
  return (
    <div className="w-full">
      <h1 className="text-green-800 pb-9">Monitoring</h1>

      <div className="grid grid-cols-[280px_1fr] gap-8 min-h-screen">
        {/* ===== Sidebar ===== */}
        <aside className="border border-green-800 rounded-lg bg-white shadow-sm flex flex-col h-[calc(100vh-120px)]">
          <div className="p-4">
            <input
              type="text"
              placeholder="Search Plant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {loading && (
                <li className="text-gray-400">กำลังโหลด...</li>
              )}

              {!loading && filteredPlants.length === 0 && (
                <li className="text-gray-400 italic">
                  ไม่พบสถานที่
                </li>
              )}

              {filteredPlants.map((plant) => (
                <li
                  key={plant.id}
                  onClick={() => setSelectedPlant(plant)}
                  className={`cursor-pointer hover:text-green-600 ${
                    selectedPlant?.id === plant.id
                      ? "font-bold text-green-700"
                      : ""
                  }`}
                >
                  ▶ {plant.name}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ===== Main Content ===== */}
        <section className="min-w-0 w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img src={HomeIcon} alt="home" />
              <h5 className="font-semibold text-green-800">
                {selectedPlant?.name ?? "Select a plant"}
              </h5>
            </div>
          </div>

          {/* Tabs */}
          <TagNav
            items={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
          />

          {/* Content */}
          <div className="bg-white rounded-b-lg px-6 py-4 min-h-[200px]">
            {renderTab()}
          </div>
        </section>
      </div>
    </div>
  );
}
