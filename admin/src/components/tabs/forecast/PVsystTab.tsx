import ForecastTable from "../../table/ForecastTable";
import { PVsystTableConfig } from "../../../configs/pvsystTable";

export default function PVsystTab() {
  return <ForecastTable config={PVsystTableConfig} />;
}
