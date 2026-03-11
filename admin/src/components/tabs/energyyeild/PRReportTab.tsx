export function PRReportTab() {

    const months = [
        "Apr-23", "May-23", "Jun-23", "Jul-23", "Aug-23",
        "Sep-23", "Oct-23", "Nov-23", "Dec-23"
    ];

    return (
        <div className="w-full">
            <div className="flex flex-col justify-between pb-3.5 text-center">
                <h3 className="text-green-800 pb-4">Name Plante</h3>
                <h3 className="text-green-800">System Size 1,300.45 Kwp</h3>
            </div>
            <div className="overflow-x-auto">

                <table className="w-full border border-gray-300 text-sm">

                    <thead className="bg-blue-700 text-white">

                        <tr>

                            <th className="border px-3 py-2">Month</th>

                            <th className="border px-3 py-2">Irradiation Actual</th>
                            <th className="border px-3 py-2">Forecast</th>
                            <th className="border px-3 py-2">Var%</th>

                            <th className="border px-3 py-2">Production Actual</th>
                            <th className="border px-3 py-2">Forecast</th>
                            <th className="border px-3 py-2">Var%</th>

                        </tr>

                    </thead>

                    <tbody>

                        {months.map((m) => (

                            <tr key={m}>

                                <td className="border px-3 py-2">{m}</td>

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