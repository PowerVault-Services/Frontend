import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import TagNav from "../../components/TagNav";
import api from "../../services/api";

import { EnergyofMonthTab } from "../../components/tabs/energyyeild/EnergyofMonthTab";
import { GraphTab } from "../../components/tabs/energyyeild/GraphTab";
import { PRReportTab } from "../../components/tabs/energyyeild/PRReportTab";

export function EnergyYieldReport() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Energy of Month");

    const [sites, setSites] = useState<any[]>([]);
    const [selectedSiteId, setSelectedSiteId] = useState<string>("");

    // ===== Default Month =====
    const today = new Date();
    const defaultMonth = `${today.getFullYear()}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}`;
    const [month, setMonth] = useState<string>(defaultMonth);

    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // ===== 1. Fetch Sites =====
    useEffect(() => {
        const fetchSites = async () => {
            try {
                const res = await api.get("/reports/energy-yield/sites");

                const siteList = res.data?.data || [];

                setSites(siteList);

                if (siteList.length > 0) {
                    setSelectedSiteId(String(siteList[0].siteId));
                }
            } catch (error) {
                console.error("Fetch sites error:", error);
            }
        };

        fetchSites();
    }, []);

    // ===== 2. Fetch Report =====
    useEffect(() => {
        if (!selectedSiteId || !month) return;

        const fetchReportData = async () => {
            try {
                setLoading(true);

                const res = await api.get(
                    `/reports/energy-yield/${selectedSiteId}`,
                    {
                        params: { month },
                    }
                );

                setReportData(res.data?.data || null);
            } catch (error) {
                console.error("Fetch report data error:", error);
                setReportData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [selectedSiteId, month]);

    // ===== Tabs =====
    const tabs = [
        { id: "Energy of Month", label: "Energy of Month" },
        { id: "Graph", label: "Graph" },
        { id: "%PR Report", label: "%PR Report" },
    ];

    const renderTab = () => {
        const tabProps = {
            siteId: selectedSiteId,
            month,
            data: reportData,
            loading,
        };

        switch (activeTab) {
            case "Energy of Month":
                return <EnergyofMonthTab {...tabProps} />;
            case "Graph":
                return <GraphTab {...tabProps} />;
            case "%PR Report":
                return <PRReportTab {...tabProps} />;
            default:
                return <div>Coming soon</div>;
        }
    };

    return (
        <div className="w-full pb-20">
            {/* ===== Header ===== */}
            <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 gap-4">
                <div className="mb-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-green-800 hover:text-green-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Report page</span>
                    </button>

                    <h1 className="text-green-800 font-bold mt-6 text-2xl">
                        Energy Yield Report
                    </h1>
                </div>

                {/* ===== Filters ===== */}
                <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-[#DEE2E6] shadow-sm">
                    
                    {/* Plant */}
                    <div className="flex flex-col gap-1.5 min-w-[220px]">
                        <label className="text-[13px] text-green-800 font-semibold pl-1">
                            Plant / Site
                        </label>
                        <select
                            value={selectedSiteId}
                            onChange={(e) => setSelectedSiteId(e.target.value)}
                            className="h-10 px-3 border border-[#DEE2E6] rounded-[8px] text-sm text-gray-700 outline-none focus:border-green-500 bg-white"
                        >
                            {sites.length === 0 && (
                                <option value="">Loading sites...</option>
                            )}

                            {sites.map((site) => (
                                <option key={site.siteId} value={site.siteId}>
                                    {site.plantName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month */}
                    <div className="flex flex-col gap-1.5 min-w-[180px]">
                        <label className="text-[13px] text-green-800 font-semibold pl-1">
                            Month
                        </label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="h-10 px-3 border border-[#DEE2E6] rounded-[8px] text-sm text-gray-700 outline-none focus:border-green-500 bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* ===== Tabs ===== */}
            <TagNav
                items={tabs}
                activeId={activeTab}
                onChange={setActiveTab}
            />

            {/* ===== Content ===== */}
            <div className="bg-white rounded-b-lg px-6 py-6 min-h-[400px] border-x border-b border-[#DEE2E6] shadow-sm">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-48 gap-3 text-green-700">
                        <span className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></span>
                        <p className="text-sm font-medium">
                            Loading report data...
                        </p>
                    </div>
                ) : (
                    renderTab()
                )}
            </div>
        </div>
    );
}