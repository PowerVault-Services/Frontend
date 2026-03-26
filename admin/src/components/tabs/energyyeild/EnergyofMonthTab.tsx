interface TabProps {
    data?: any;
    month?: string;
    siteId?: string;
}

export function EnergyofMonthTab({ data, month }: TabProps) {
    const yearNum = month ? parseInt(month.split('-')[0]) : new Date().getFullYear();
    const monthNum = month ? parseInt(month.split('-')[1]) : new Date().getMonth() + 1;
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // ✅ FIX: ใช้ monthTable จาก API
    const dailyData = data?.monthTable || [];

    const displayMonth = month
        ? new Date(month).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
          })
        : "";

    if (!data) {
        return <div className="text-center py-10 text-gray-500">No data</div>;
    }

    return (
        <div className="w-full">
            <div className="flex justify-between pb-3.5">
                <h3 className="text-green-800 font-bold">{displayMonth}</h3>
            </div>

            <div className="pb-[62px] overflow-x-auto">
                <table className="w-full border border-gray-300 text-sm whitespace-nowrap">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2">Date</th>
                            <th className="border px-3 py-2">Energy produced (kWh)</th>
                            <th className="border px-3 py-2">Radiation (Wh/m2)</th>
                            <th className="border px-3 py-2">From Grid (kWh)</th>
                            <th className="border px-3 py-2">Consumption (kWh)</th>
                            <th className="border px-3 py-2">Revenue (Baht)</th>
                            <th className="border px-3 py-2">Module Temp (°C)</th>
                            <th className="border px-3 py-2">Down time client</th>
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((day) => {
                            const dayRecord =
                                dailyData.find((d: any) => {
                                    const dDate = new Date(d.date);
                                    return dDate.getDate() === day;
                                }) || {};

                            return (
                                <tr key={day} className="hover:bg-slate-50 transition-colors">
                                    <td className="border px-3 py-2 text-center font-semibold bg-gray-50">
                                        {day}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                        {dayRecord.energy ?? "-"}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                        {dayRecord.radiation ?? "-"}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                        {dayRecord.grid ?? "-"}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                        {dayRecord.consumption ?? "-"}
                                    </td>
                                    <td className="border px-3 py-2 text-center text-green-600">
                                        {dayRecord.revenue ?? "-"}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                        {dayRecord.moduleTemp ?? "-"}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                        {dayRecord.downTime ?? "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}