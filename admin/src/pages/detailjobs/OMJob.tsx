import { useState } from "react";

import TagNav from "../../components/TagNav";

import OMInformationTab from "../../components/tabs/clientdata/powerservice/ServiceInformationTab";
import OMPVLayoutTab from "../../components/tabs/clientdata/powerservice/OMPVLayoutTab";
import OMPVStringLayoutTab from "../../components/tabs/clientdata/powerservice/OMPVStringLayoutTab";

type Project = any;

interface Props {
  project: Project;
}

const homeTags = [
  { id: "Information", label: "Information" },
  { id: "PV Layout", label: "PV Layout" },
  { id: "PV String Layout", label: "PV String Layout" },
];

export default function OMJob({ project }: Props) {
  const [activeProject, setActiveProject] = useState<string>("Information");
  const siteId = project?.id;

  if (!project) return null; // ✅ กัน crash

  const renderTabContent = () => {
    switch (activeProject) {
      case "Information":
        return <OMInformationTab project={project} />;

      case "PV Layout":
        return <OMPVLayoutTab siteId={siteId} type="PV_LAYOUT" />;

      case "PV String Layout":
        return (
          <OMPVStringLayoutTab
            siteId={siteId}
            type="PV_STRING_LAYOUT"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
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
      <section className="min-w-0">
        <div className="flex items-center justify-between w-auto">
          <TagNav
            items={homeTags}
            activeId={activeProject}
            onChange={setActiveProject}
          />
        </div>

        <div className="border border-green-800 bg-white rounded-b-lg px-[27px] py-[13px] min-h-[200px]">
          {renderTabContent()}
        </div>
      </section>
    </div>
  );
}