import type { ForecastTableConfig } from "../types/forecastTable";

export const PVsystTableConfig: ForecastTableConfig = {
  fixedColumn: { key: "month", label: "Month" },
  columns: [
    { key: "globInc", label: "GlobInc (kWh/m2)" },
    { key: "eGrid", label: "E_Grid (kWh)" },
    { key: "prRatio", label: "PR Ratio" },
  ],
  rows: [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December","Total",
  ],
};
