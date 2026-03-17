import EnergyProductionChart from "../../charts/EnergyProductionChart";
import EnergyTrendChart from "../../charts/EnergyTrendChart";

const data = [
    { day: "01", energy: 5000, radiation: 4500 },
    { day: "02", energy: 5500, radiation: 4300 },
    { day: "03", energy: 5200, radiation: 4700 },
    { day: "04", energy: 4800, radiation: 4200 },
];

const productionData = [
    { day: "01", energy: 4500, radiation: 4300 },
    { day: "02", energy: 5500, radiation: 5200 },
    { day: "03", energy: 4800, radiation: 4700 },
    { day: "04", energy: 3000, radiation: 2900 },
    { day: "05", energy: 5800, radiation: 5700 }
];

const trendData = [
    { day: "01", pv: 20, grid: 10 },
    { day: "02", pv: 25, grid: 12 },
    { day: "03", pv: 22, grid: 15 },
    { day: "04", pv: 10, grid: 8 },
    { day: "05", pv: 24, grid: 14 }
];

const apiData = [
  { day: 1, energy: 4500, radiation: 4200 },
  { day: 2, energy: 5300, radiation: 5000 },
  { day: 5, energy: 6100, radiation: 5900 }
];

export function GraphTab() {
    return (
        <div className="w-full">

            {/* <div className="flex justify-between pb-3.5">
                <h3 className="text-green-800">Graph</h3>
            </div> */}
            <div className="">
                <EnergyProductionChart
                    data={apiData}
                    year={2024}
                    month={7}
                />
                <EnergyTrendChart data={trendData} />
            </div>
        </div>
    );
}

