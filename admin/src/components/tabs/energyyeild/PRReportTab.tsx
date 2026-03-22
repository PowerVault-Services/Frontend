interface TabProps {
    data?: any;
    month?: string;
}

export function PRReportTab({ data }: TabProps) {
    // ✅ FIX: ใช้ prReport จาก API
    const reportList = data?.prReport || [];

    // ✅ FIX: ใช้ site จาก API
    const siteName = data?.site?.plantName || "Unknown Plant";
    const systemSize = data?.site?.systemSizeKWp || "-";

    if (!data) {
        return <div className="text-center py-10 text-gray-500">No data</div>;
    }

    return (
        <div className="w-full">
            <div className="flex flex-col justify-between pb-3.5 text-center">
                <h3 className="text-green-800 pb-2 text-lg font-bold">
                    {siteName}
                </h3>
                <h3 className="text-green-800 font-medium">
                    System Size {systemSize} kWp
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-[#B9B9B9] text-sm whitespace-nowrap">
                    <thead className="bg-green-800 text-white">
                        <tr>
                            <th rowSpan={2} className="border border-green-700 px-3 py-2">
                                Month
                            </th>
                            <th colSpan={3} className="border border-green-700 px-3 py-2">
                                Irradiation (Wh / m2)
                            </th>
                            <th colSpan={3} className="border border-green-700 px-3 py-2">
                                Grid
                            </th>
                            <th colSpan={3} className="border border-green-700 px-3 py-2">
                                Production (kWh)
                            </th>
                        </tr>
                        <tr className="bg-green-700">
                            <th className="border px-3 py-1">Actual</th>
                            <th className="border px-3 py-1">Forecast</th>
                            <th className="border px-3 py-1">Var%</th>
                            <th className="border px-3 py-1">Actual</th>
                            <th className="border px-3 py-1">Forecast</th>
                            <th className="border px-3 py-1">Var%</th>
                            <th className="border px-3 py-1">Actual</th>
                            <th className="border px-3 py-1">Forecast</th>
                            <th className="border px-3 py-1">Var%</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportList.map((mData: any, index: number) => (
                            <tr key={index} className="hover:bg-slate-50">
                                <td className="border px-3 py-2 text-center bg-gray-50 font-medium">
                                    {mData.monthName || index + 1}
                                </td>

                                {/* Irradiation */}
                                <td className="border px-3 py-2 text-center">
                                    {mData.irradiation?.actual ?? "-"}
                                </td>
                                <td className="border px-3 py-2 text-center">
                                    {mData.irradiation?.forecast ?? "-"}
                                </td>
                                <td className="border px-3 py-2 text-center">
                                    {mData.irradiation?.varPct ?? "-"}
                                </td>

                                {/* Grid */}
                                <td className="border px-3 py-2 text-center">
                                    {mData.grid?.actual ?? "-"}
                                </td>
                                <td className="border px-3 py-2 text-center">
                                    {mData.grid?.forecast ?? "-"}
                                </td>
                                <td className="border px-3 py-2 text-center">
                                    {mData.grid?.varPct ?? "-"}
                                </td>

                                {/* Production */}
                                <td className="border px-3 py-2 text-center">
                                    {mData.production?.actual ?? "-"}
                                </td>
                                <td className="border px-3 py-2 text-center">
                                    {mData.production?.forecast ?? "-"}
                                </td>
                                <td className="border px-3 py-2 text-center font-bold text-green-600">
                                    {mData.production?.varPct ?? "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}