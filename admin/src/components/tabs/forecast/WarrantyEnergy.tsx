import { useEffect, useState } from "react";
import ForecastTable from "../../table/ForecastTable";
import { WarrantyEnergyTableConfig } from "../../../configs/warrantyEnergyTable";
import {
  getProjectDetail,
  updateForecastWarrantyEnergy,
} from "../../../services/client.api";

interface Props {
  siteId?: number;
}

export default function WarrantyEnergyTab({ siteId }: Props) {

  const [rows, setRows] = useState<any[]>([]); // ✅ เพิ่ม
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await getProjectDetail(siteId);

        setRows(
          (res as any)?.forecastWarrantyEnergyRows ||
          (res as any)?.forecastYearlyRows ||
          (res as any)?.forecast ||
          (res as any)?.rows ||
          []
        );

        console.log("ROWS >>>", rows);

      } catch (err) {
        console.error(err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [siteId]);

  const handleSave = async () => {
    if (!siteId) return;

    try {
      await updateForecastWarrantyEnergy(siteId, rows);
      alert("Saved!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      {loading && <div>Loading...</div>}

      <ForecastTable
        config={WarrantyEnergyTableConfig}
        data={rows}
        onChange={setRows}
      />

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Save
      </button>

    </div>
  );
}