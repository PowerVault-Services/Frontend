import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import TagNav from "../../components/TagNav";

import { EnergyofMonthTab } from "../../components/tabs/energyyeild/EnergyofMonthTab";
import { GraphTab } from "../../components/tabs/energyyeild/GraphTab";
import { PRReportTab } from "../../components/tabs/energyyeild/PRReportTab";

export function EnergyYieldReport() {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Energy of Month");

    const tabs = [
        { id: "Energy of Month", label: "Energy of Month" },
        { id: "Graph", label: "Graph" },
        { id: "%PR Report", label: "%PR Report" },
    ];

    const renderTab = () => {
        switch (activeTab) {

            case "Energy of Month":
                return <EnergyofMonthTab />;

            case "Graph":
                return <GraphTab />;

            case "%PR Report":
                return <PRReportTab />;

            default:
                return <div>Coming soon</div>;
        }
    };

    return (
        <div className="w-full">

            <div className="flex justify-between pb-2.5">

                <div className="mb-6">

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-green-800"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Report page</span>
                    </button>

                    <h1 className="text-green-800 font-bold mt-6">
                        Energy Report Yield
                    </h1>

                </div>

            </div>

            <TagNav
                items={tabs}
                activeId={activeTab}
                onChange={setActiveTab}
            />

            <div className="bg-white rounded-b-lg px-6 py-4 min-h-[200px]">
                {renderTab()}
            </div>

        </div>
    );
}