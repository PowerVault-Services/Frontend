import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import TagNav from "../../components/TagNav";

import InformationTab from "../../components/tabs/clientdata/InformationTab";
import WarrantyDetailTab from "../../components/tabs/clientdata/WarrantyDetailTab";
import ForecastDetailTab from "../../components/tabs/forecast/ForecastDetailTab";
import OtherTable from "../../components/table/OtherTable";

import { getThailandProjects } from "../../services/api";

export default function ClientDataDetail() {
    const { id } = useParams();
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

    // ================= FETCH DETAIL FROM SAME SOURCE AS HOME =================
    useEffect(() => {
        if (!id) return;

        const fetchDetail = async () => {
            try {
                setLoading(true);

                const res = await getThailandProjects({
                    page: 1,
                    pageSize: 1000, // ดึงมาเยอะพอสำหรับหา id
                });

                if (res?.data?.items) {
                    const found = res.data.items.find(
                        (item: any) => item.siteId === Number(id)
                    );

                    setProject(found || null);
                }

            } catch (error) {
                console.error("โหลดรายละเอียดโครงการไม่สำเร็จ:", error);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    // ================= RENDER TAB =================
    const renderTabContent = () => {
        switch (activeProject) {
            case "Information":
                return <InformationTab project={project} />;
            case "Warranty Detail":
                return <WarrantyDetailTab project={project} />;
            case "Forecast":
                return <ForecastDetailTab project={project} />;
            case "Other":
                return <OtherTable project={project} />;
            default:
                return null;
        }
    };

    // ================= LOADING =================
    if (loading) {
        return <div className="p-10">กำลังโหลดข้อมูล...</div>;
    }

    // ================= NOT FOUND =================
    if (!project) {
        return <div className="p-10">ไม่พบข้อมูลโครงการ</div>;
    }

    return (
        <div className="w-full">
            <div className="flex flex-row justify-between">
                <h1 className="pb-9 text-green-800 flex flex-col gap-8">
                    <span>ข้อมูล : {project?.projectName?.trim() || "-"}</span>
                    <span>
                        Systemsize :{" "}
                        {project?.systemSizeKWp !== undefined &&
                        project?.systemSizeKWp !== null
                            ? Number(project.systemSizeKWp).toLocaleString()
                            : "-"}{" "}
                        kWp
                    </span>
                </h1>

                <h2 className="items-end pb-9 text-green-700 flex flex-col gap-8">
                    <span>
                        Start Warranty :{" "}
                        {project?.startWarranty || "-"}
                    </span>
                    <span>
                        End Warranty :{" "}
                        {project?.endWarranty || "-"}
                    </span>
                </h2>
            </div>

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