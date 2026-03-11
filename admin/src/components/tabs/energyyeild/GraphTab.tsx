import {
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

const data = [
    { day: "01", energy: 5000, radiation: 4500 },
    { day: "02", energy: 5500, radiation: 4300 },
    { day: "03", energy: 5200, radiation: 4700 },
    { day: "04", energy: 4800, radiation: 4200 },
];

export function GraphTab() {
    return (
        <div className="w-full">

            <div className="flex justify-between pb-3.5">
                <h3 className="text-green-800">Graph</h3>
            </div>
            <div>
                <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={data}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="day" />

                        <YAxis />

                        <Tooltip />

                        <Bar dataKey="energy" fill="#3b82f6" />

                        <Line
                            type="monotone"
                            dataKey="radiation"
                            stroke="#f97316"
                            strokeWidth={2}
                        />

                    </BarChart>

                </ResponsiveContainer>
            </div>
        </div>
    );
}

