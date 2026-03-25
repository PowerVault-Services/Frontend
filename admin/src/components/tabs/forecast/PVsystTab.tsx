import { useEffect, useState } from "react";
import ForecastTable from "../../table/ForecastTable";
import { PVsystTableConfig } from "../../../configs/pvsystTable";
import { getProjectDetail } from "../../../services/client.api";
import { generateForecastDefaults } from "../../../services/client.api";
import { saveForecastPVsyst } from "../../../services/client.api";

interface Props {
  siteId?: number;
}

export default function PVsystTab({ siteId }: Props) {

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!siteId) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await getProjectDetail(siteId);

        setRows(
          res?.forecastMonthlyRows ||
          res?.forecastRows ||
          res?.forecast ||
          res?.rows ||
          []
        );

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
      await saveForecastPVsyst(siteId, rows);
      alert("Saved!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    if (!siteId) return;

    try {
      const res = await generateForecastDefaults(siteId);

      // 🔥 update table ทันที
      setRows(res || []);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>

      {loading && <div>Loading...</div>}

      <ForecastTable
        config={PVsystTableConfig}
        data={rows}
        onChange={setRows}
      />

      <button
        onClick={handleSave}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Save
      </button>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
      >
        Generate Default
      </button>

    </div>
  );
}