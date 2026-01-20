import { type ForecastTableConfig } from "../types/forecastTable";

export const WarrantyEnergyTableConfig: ForecastTableConfig = {
  fixedColumn: { key: "year", label: "Years" },
  columns: [
    { key: "degradation", label: "Degradation of PV Module (%)" },
    { key: "annual", label: "Annual Electricity Production (kWh/Years)" },
    { key: "warranty", label: "Warranty Energy Output (kWh/Year)" },
  ],
  rows: ["1", "2", "3", "4", "5", "Total"],
};
