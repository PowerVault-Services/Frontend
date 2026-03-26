import { useState } from "react";
import TagNav from "../../components/TagNav";
import LayoutImageTab from "../../components/tabs/clientdata/LayoutImageTab";

export default function JobPage({ project, config }: any) {
  const [active, setActive] = useState(config.tabs?.[0]?.id);

  const activeTab = config.tabs?.find((t: any) => t.id === active);

  const Component = activeTab?.component;
  const layoutType = activeTab?.type;

  return (
    <div className="w-full h-auto">
      {/* Header */}
      <div className="flex flex-row justify-between items-center pb-[18px]">
        <h2 className="text-green-800 flex flex-col gap-5">
          <span>ข้อมูล : {project.name}</span>
          <span>
            Systemsize :{" "}
            {project.systemSize ?? project.capacityKWp ?? 0} kWp
          </span>
        </h2>

        <h3 className="items-end text-green-700 flex flex-col gap-5">
          <span>
            Start Warranty :{" "}
            {project.startWarranty !== "-"
              ? new Date(project.startWarranty).toLocaleDateString("en-CA")
              : "-"}
          </span>

          <span>
            End Warranty :{" "}
            {project.endWarranty !== "-"
              ? new Date(project.endWarranty).toLocaleDateString("en-CA")
              : "-"}
          </span>
        </h3>
      </div>

      {/* Tabs */}
      <TagNav
        items={config.tabs || []}
        activeId={active}
        onChange={setActive}
      />

      {/* Content */}
      <div className="border border-green-800 bg-white p-4 min-h-[200px]">
        {/* ✅ 1. ถ้ามี component */}
        {Component && <Component project={project} />}

        {/* ✅ 2. ถ้าเป็น layout */}
        {!Component && layoutType && (
          <LayoutImageTab siteId={project.id} type={layoutType} />
        )}

        {/* ❌ fallback */}
        {!Component && !layoutType && "No content"}
      </div>
    </div>
  );
}