import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TagNav from "../../components/TagNav";

import PowerVaultThailandTab from "../../components/tabs/PowerVaultThailandTab";
import PowerVaultServiceTab from "../../components/tabs/PowerVaultServiceTab";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import { getThailandProjects } from "../../services/client.api";

export default function HomeClientData() {

    const homeTags = [
        { id: "PowerVault (Thailand)", label: "PowerVault (Thailand)" },
        { id: "PowerVault Service", label: "PowerVault Service" },
    ];

    const [activeProject, setActiveProject] = useState<string>("PowerVault (Thailand)");
    const [projects, setProjects] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // ==============================
    // FETCH PROJECTS FROM API
    // ==============================
    const fetchProjects = async (page = 1) => {
        setIsLoading(true);

        try {
            const res = await getThailandProjects({
                page,
                pageSize: pagination.pageSize,
            });

            console.log("API Response:", res);

            if (res?.data) {
                const { items, page, pageSize, total } = res.data;

                setProjects(
                    (items || []).map((item: any) => ({
                        id: item.siteId,
                        projectNo: item.projectNo,
                        projectName: item.projectName,
                        capacityKwp: item.systemSizeKWp,
                        endWarranty: item.endWarranty,
                        status: item.status,
                    }))
                );

                setPagination({
                    page: page || 1,
                    pageSize: pageSize || 10,
                    total: total || 0,
                    totalPages: Math.ceil((total || 0) / (pageSize || 10)),
                });
            }

        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setIsLoading(false);
        }
    };


    // ==============================
    // LOAD DATA WHEN TAB ACTIVE
    // ==============================
    useEffect(() => {
        if (activeProject === "PowerVault (Thailand)") {
            fetchProjects(1);
        }
    }, [activeProject]);

    // ==============================
    // RENDER TAB CONTENT
    // ==============================
    const renderTabContent = () => {
        switch (activeProject) {
            case "PowerVault (Thailand)":
                return (
                    <PowerVaultThailandTab
                        data={projects}
                        isLoading={isLoading}
                        pagination={pagination}
                        onPageChange={fetchProjects}
                    />
                );

            case "PowerVault Service":
                return <PowerVaultServiceTab />;

            default:
                return null;
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between pb-9">
                <h1 className="text-green-800">Client Data</h1>

                <Link to="/service/new/step1">
                    <button className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5">
                        <img src={AddIcon} alt="" />
                        New Project
                    </button>
                </Link>
            </div>

            {/* ===== Main Content ===== */}
            <section className="min-w-0">
                {/* Tabs */}
                <div className="flex items-center justify-between w-[1112px]">
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