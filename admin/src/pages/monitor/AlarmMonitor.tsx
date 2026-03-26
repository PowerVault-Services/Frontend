import { useState } from "react";
import TagNav from "../../components/TagNav";

import ActiveAlarmsTab from "../../components/tabs/ActiveAlarmsTab";
import HistoricalAlarmsTab from "../../components/tabs/HistoricalAlarmsTab";

export default function AlarmMonitor() {

  const homeTags = [
    { id: "active", label: "Active Alarms" },
    { id: "historical", label: "Historical Alarms" },
  ];

  const [activeProject, setActiveProject] = useState<string>("active");

  const renderTabContent = () => {
    switch (activeProject) {
      case "active":
        return <ActiveAlarmsTab />;

      case "historical":
        return <HistoricalAlarmsTab />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-green-800 pb-9">Alarm</h1>

      {/* ===== Main Content ===== */}
      <section className="w-full">

        {/* Tabs */}
        <div className="flex items-center justify-between">
          <TagNav
            items={homeTags}
            activeId={activeProject}
            onChange={setActiveProject}
          />
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-b-lg px-[27px] py-[13px] min-h-[200px]">
          {renderTabContent()}
        </div>

      </section>
    </div>
  );
}