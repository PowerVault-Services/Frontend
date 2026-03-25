import { useState } from "react";
import TagNav from "../../components/TagNav";

import InspectionInformationTab from "../../components/tabs/clientdata/powerservice/InspectionInformationTab";
import InspectionPVLayoutTab from "../../components/tabs/clientdata/powerservice/InspectionPVLayoutTab";
import InspectionPVStringLayoutTab from "../../components/tabs/clientdata/powerservice/InspectionPVStringLayoutTab";

type Project = any;

interface Props {
  project: Project;
}


const homeTags = [
  { id: "Information", label: "Information" },
  { id: "PV Layout", label: "PV Layout" },
  { id: "PV String Layout", label: "PV String Layout" },
];

export default function InspectionJob({ project }: Props) {
  const [activeProject, setActiveProject] = useState<string>("Information");

  const renderTabContent = () => {
    switch (activeProject) {
      case "Information":
        return <InspectionInformationTab project={project} />;
      case "PV Layout":
        return <InspectionPVLayoutTab siteId={siteId} type="PV_LAYOUT" />;
      case "PV String Layout":
        return <InspectionPVStringLayoutTab siteId={siteId} type="PV_STRING_LAYOUT" />;
      default:
        return null;
    }
  };

  const siteId = project?.id;

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

        {/* Content Box */}
        <div className="border border-green-800 bg-white rounded-b-lg px-[27px] py-[13px] min-h-[200px]">
          {renderTabContent()}
        </div>
      </section>
    </div>
  );
}
