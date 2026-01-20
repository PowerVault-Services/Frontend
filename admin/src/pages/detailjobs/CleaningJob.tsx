import { useState } from "react";
import type { Project } from "../../mock/project";
import TagNav from "../../components/TagNav";
import CleaningInformationTab from "../../components/tabs/clientdata/powerservice/ServiceInformationTab";
import CleaningPVLayoutTab from "../../components/tabs/clientdata/powerservice/ServicePVLayoutTab";




interface Props {
  project: Project;
}

const homeTags = [
  { id: "Information", label: "Information" },
  { id: "PV Layout", label: "PV Layout" },
];

export default function CleaningJob({ project }: Props) {
  const [activeProject, setActiveProject] = useState<string>("Information");

  const renderTabContent = () => {
    switch (activeProject) {
      case "Information":
        return <CleaningInformationTab />;
      case "PV Layout":
        return <CleaningPVLayoutTab />;
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
          <span>Systemsize : {project.systemSize} kWp</span>
        </h2>
        <h3 className="items-end text-green-700 flex flex-col gap-5">
          <span>Start Warranty : {project.startWarranty}</span>
          <span>End Warranty : {project.endWarranty}</span>
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
