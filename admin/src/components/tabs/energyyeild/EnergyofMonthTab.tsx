export function EnergyofMonthTab() {
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="w-full">

            <div className="flex justify-between pb-3.5">
                <h3 className="text-green-800">July 2026</h3>
            </div>

            <div className="pb-[62px]">
                <table className="w-full border border-gray-300 text-sm">

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

                        {days.map((day) => (

                            <tr key={day}>

                                <td className="border px-3 py-2 text-center">{day}</td>

                                <td className="border px-3 py-2"></td>
                                <td className="border px-3 py-2"></td>
                                <td className="border px-3 py-2"></td>
                                <td className="border px-3 py-2"></td>
                                <td className="border px-3 py-2"></td>
                                <td className="border px-3 py-2"></td>
                                <td className="border px-3 py-2"></td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            </div>
        </div>
    );
}
