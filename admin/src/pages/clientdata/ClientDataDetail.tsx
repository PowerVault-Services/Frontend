import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TagNav from "../../components/TagNav";

import InformationTab from "../../components/tabs/clientdata/InformationTab";
import WarrantyDetailTab from "../../components/tabs/clientdata/WarrantyDetailTab";
import ForecastDetailTab from "../../components/tabs/forecast/ForecastDetailTab";
import OtherTable from "../../components/table/OtherTable";
import LayoutTab from "../../components/tabs/clientdata/LayoutTab";

import { getProjectDetail } from "../../services/client.api";


export default function ClientDataDetail() {

    const { id } = useParams();
    const siteId = Number(id);

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const homeTags = [
        { id: "Information", label: "Information" },
        { id: "Warranty Detail", label: "Warranty Detail" },
        { id: "Layout Rooftop", label: "Layout Rooftop" },
        { id: "Layout PV String", label: "Layout PV String" },
        { id: "Forecast", label: "Forecast" },
        { id: "Other", label: "Other" },
    ];

    const [activeProject, setActiveProject] = useState<string>("Information");

    useEffect(() => {
        if (!siteId) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await getProjectDetail(siteId);

                console.log("Data from Detail API:", res); // 👈 เพิ่มบรรทัดนี้

                setProject(res);
            } catch (error) {
                console.error(error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [siteId]);

    const renderTabContent = () => {
        switch (activeProject) {
            case "Information":
                return <InformationTab project={project} />;

            case "Warranty Detail":
                return <WarrantyDetailTab project={project} />;

            case "Layout Rooftop":
                return <LayoutTab siteId={siteId} type="PV_LAYOUT" />;

            case "Layout PV String":
                return <LayoutTab siteId={siteId} type="PV_STRING_LAYOUT" />;

            case "Forecast":
                return <ForecastDetailTab project={project} />;

            case "Other":
                return <OtherTable project={project} />;

            default:
                return null;
        }
    };

    if (loading) return <div className="p-10">กำลังโหลดข้อมูล...</div>;
    if (!project) return <div className="p-10">ไม่พบข้อมูลโครงการ</div>;

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between">

                <h1 className="pb-9 text-green-800 flex flex-col gap-8">
                    <span>ข้อมูล : {project.name}</span>
                    <span>Systemsize : {project.capacityKWp} kWp</span>
                </h1>

                <h2 className="text-green-700 flex flex-col gap-8">
                    <span>Start Warranty :{" "}
                        {project?.warrantyStart
                            ? new Date(project.warrantyStart).toLocaleDateString("en-CA")
                            : "-"}</span>
                    <span>
                        End Warranty :{" "}
                        {project?.warrantyEnd
                            ? new Date(project.warrantyEnd).toLocaleDateString("en-CA")
                            : "-"}
                    </span>
                </h2>

            </div>

            <TagNav
                items={homeTags}
                activeId={activeProject}
                onChange={setActiveProject}
            />

            <div className="border border-green-800 bg-white rounded-b-lg px-[27px] py-[13px] min-h-[800px] h-auto">
                {renderTabContent()}
            </div>

        </div>
    );
}