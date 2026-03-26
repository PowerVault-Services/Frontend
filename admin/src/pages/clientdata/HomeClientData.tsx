import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TagNav from "../../components/TagNav";

import PowerVaultThailandTab from "../../components/tabs/PowerVaultThailandTab";
import PowerVaultServiceTab from "../../components/tabs/PowerVaultServiceTab";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import { getThailandProjects } from "../../services/client.api";

import CreateServiceJobModal from "../../components/CreateServiceJobModal";

export default function HomeClientData() {

    const homeTags = [
        { id: "PowerVault (Thailand)", label: "PowerVault (Thailand)" },
        { id: "PowerVault Service", label: "PowerVault Service" },
    ];

    const [activeProject, setActiveProject] = useState<string>("PowerVault (Thailand)");
    const [projects, setProjects] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 100,
        total: 0,
        totalPages: 1
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [filters, setFilters] = useState({
        projectNo: "",
        projectName: "",
        systemSizeKWp: "",
        endWarranty: "",
        status: "all",
    });

    // ==============================
    // FETCH PROJECTS FROM API
    // ==============================
    const fetchProjects = async (pageParam = page) => {
        setIsLoading(true);

        try {
            const res = await getThailandProjects({
                page: pageParam,
                pageSize: 10,

                // 🔥 เพิ่มทั้งหมดนี้
                projectNo: filters.projectNo || undefined,
                projectName: filters.projectName || undefined,
                systemSizeKWp: filters.systemSizeKWp
                    ? Number(filters.systemSizeKWp)
                    : undefined,
                status: filters.status !== "all" ? filters.status : undefined,
                endWarrantyBefore: filters.endWarranty || undefined,
            });

            const { items, page, pageSize, total } = res.data;

            setProjects(items);

            setPagination({
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            });

            setPage(page); // 🔥 sync state

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    // ==============================
    // LOAD DATA WHEN TAB ACTIVE
    // ==============================
    useEffect(() => {
        if (activeProject === "PowerVault (Thailand)") {
            fetchProjects(page);
        }
    }, [activeProject, page]);

    useEffect(() => {
        if (activeProject === "PowerVault (Thailand)") {
            fetchProjects(1); // 🔥 reset page
        }
    }, [filters]);

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
                        onPageChange={setPage}
                        filters={filters}          // 🔥 เพิ่ม
                        setFilters={setFilters}    // 🔥 เพิ่ม
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

                {activeProject === "PowerVault Service" ? (
                    // กรณี PowerVault Service: แสดง Modal
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5 hover:bg-green-800 transition-colors"
                    >
                        <img src={AddIcon} alt="" />
                        New Project
                    </button>
                ) : (
                    // กรณี PowerVault (Thailand): ไปหน้า Step 1 ตามเดิม
                    <Link to="/client/create-plant">
                        <button className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5 hover:bg-green-800 transition-colors">
                            <img src={AddIcon} alt="" />
                            New Project
                        </button>
                    </Link>
                )}
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
                <div className="bg-white rounded-b-lg px-[27px] py-[13px]">
                    {renderTabContent()}
                </div>
            </section>
            {/* Modal Section */}
            {isModalOpen && (
                <CreateServiceJobModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>

    );
}