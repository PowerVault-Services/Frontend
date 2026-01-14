import { useParams } from "react-router-dom";
import { PROJECTS } from "../../mock/project";
import { useState } from "react";
import TagNav from "../../components/TagNav";

import InformationTab from "../../components/tabs/clientdata/InformationTab";
import WarrantyDetailTab from "../../components/tabs/clientdata/WarrantyDetailTab";

export default function ProjectDetail() {
    const { id } = useParams();

    const project = PROJECTS.find(p => p.id === id);

    const homeTags = [
        { id: "Information", label: "Information" },
        { id: "Warranty Detail", label: "Warranty Detail" },
        { id: "Layout Rooftop", label: "Layout Rooftop" },
        { id: "Layout PV String", label: "Layout PV String" },
        { id: "Forecast", label: "Forecast" },
        { id: "Other", label: "Other" },
    ];

    const [activeProject, setActiveProject] = useState<string>("Information");

    const renderTabContent = () => {
        switch (activeProject) {
            case "Information":
                return <InformationTab />;
            case "Warranty Detail":
                return <WarrantyDetailTab />;
            default:
                return null;
        }
    };

    if (!project) {
        return <div className="p-10">ไม่พบข้อมูลโครงการ</div>;
    }

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between">
                <h1 className="pb-9 text-green-800 flex flex-col gap-8">
                    <span>ข้อมูล : {project.name}</span>
                    <span>Systemsize : {project.systemSize} kWp</span>
                </h1>
                <h2 className="items-end pb-9 text-green-700 flex flex-col gap-8">
                    <span>Start Warranty : {project.startWarranty}</span>
                    <span>End Warranty : {project.endWarranty}</span>
                </h2>
            </div>

            {/* ===== Main Content ===== */}
            <section className="min-w-0">
                {/* Tabs */}
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
