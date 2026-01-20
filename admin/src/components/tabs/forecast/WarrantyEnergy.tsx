import ForecastTable from "../../table/ForecastTable";
import { WarrantyEnergyTableConfig } from "../../../configs/warrantyEnergyTable";

export default function WarrantyEnergyTab() {
  return <ForecastTable config={WarrantyEnergyTableConfig} />;
}
