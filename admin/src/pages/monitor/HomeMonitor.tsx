import { useEffect, useState } from "react";
import HomeIcon from "../../assets/icons/home.svg";
import TagNav from "../../components/TagNav";

//tabs
import OverviewTab from "../../components/tabs/OverviewTab";
// import AlarmTab from "../../components/tabs/AlarmTab";
// import PRTab from "../../components/tabs/PRTab";
// import ReportTab from "../../components/tabs/ReportTab";

interface Plant {
  id: number;
  name: string;
}

export default function HomeMonitor() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeProject, setActiveProject] = useState("Overview");

  const homeTags = [
    { id: "Overview", label: "Overview" },
    { id: "Alarm", label: "Alarm" },
    { id: "%PR", label: "%PR" },
    { id: "Report", label: "Report" },
  ];

  useEffect(() => {
    setLoading(true);
    fetch("https://your-api.com/plants")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const renderTabContent = () => {
    switch (activeProject) {
      case "Overview":
        return <OverviewTab />;
      case "Alarm":
        return <div>Alarm</div>
      case "%PR":
        return <div>%PR</div>
      case "Report":
        return <div>Report</div>
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-green-800 pb-9">Monitoring</h1>

      {/* ===== Main Layout ===== */}
      <div className="grid grid-cols-[auto_1fr] gap-3.5 items-start">

        {/* ===== Sidebar ===== */}
        <aside className="border border-green-800 rounded-lg py-6 px-[11px] bg-white">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter Plant Name"
              className="
                w-full border border-green-200 rounded-lg p-[9px]
                text-[14px] placeholder:text-green-500
                focus:outline-none focus:ring-1 focus:ring-green-500
              "
            />
          </div>

          <ul className="space-y-2 text-sm text-green-800 overflow-y-auto max-h-[70vh]">
            {loading && <li className="text-gray-400">Loading...</li>}
            {!loading && plants.length === 0 && (
              <li className="text-gray-400">No plant found</li>
            )}
            {plants.map((plant) => (
              <li
                key={plant.id}
                className="cursor-pointer hover:text-green-600"
              >
                ▶ {plant.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* ===== Main Content ===== */}
        <section className="min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1.5">
            <img src={HomeIcon} alt="home" className="w-4 h-4" />
            <h5 className="text-xl font-semibold text-green-800">
              Alinco (Thailand)
            </h5>
          </div>

          {/* Tabs + Info Box */}
          <div className="flex items-center justify-between">
            <TagNav
              items={homeTags}
              activeId={activeProject}
              onChange={setActiveProject}
            />

            <div className="flex items-center justify-between gap-3 border border-green-400 rounded-lg text-sm bg-white w-[409px] px-6 py-0.5 whitespace-nowrap">
              <span className="font-semibold text-green-700 text-[18px]">Name Alarm</span>
              <span>18 October 2025</span>
              <span>7:30 A.M.</span>
            </div>
          </div>

          {/* Content Box */}
          <div className="bg-white rounded-b-lg px-[27px] py-[13px] min-h-[200px]">
            {renderTabContent()}
          </div>
        </section>
      </div>
    </div>
  );
}
