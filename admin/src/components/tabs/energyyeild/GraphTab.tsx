import EnergyProductionChart from "../../charts/EnergyProductionChart";
import EnergyTrendChart from "../../charts/EnergyTrendChart";

interface TabProps {
    data?: any;
    month?: string;
}

export function GraphTab({ data, month }: TabProps) {
    const yearNum = month ? parseInt(month.split('-')[0]) : new Date().getFullYear();
    const monthNum = month ? parseInt(month.split('-')[1]) : new Date().getMonth() + 1;

    // ✅ FIX: ใช้ charts จาก API
    const apiData = data?.charts?.production || [];
    const trendData = data?.charts?.trend || [];

    if (!data) {
        return <div className="text-center py-10 text-gray-500">No data</div>;
    }

    return (
        <div className="w-full">
            <div className="flex flex-col gap-8">
                <EnergyProductionChart
                    data={apiData}
                    year={yearNum}
                    month={monthNum}
                />

                <EnergyTrendChart data={trendData} />
            </div>
        </div>
    );
}