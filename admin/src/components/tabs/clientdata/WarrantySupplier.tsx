import { useEffect, useState } from "react";
import WarrantyTable from "../../table/WarrantyTable";
import { getProjectDetail } from "../../../services/client.api";

interface Props {
  siteId?: number;
}

export default function WarrantySupplier({ siteId }: Props) {

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWarranty = async () => {

    if (!siteId) {
      setRows([]);
      return;
    }

    setLoading(true);

    try {

      const res = await getProjectDetail(siteId);

      const items = res?.data?.warrantySupplierItems ?? [];

      setRows(items);

    } catch (error) {

      console.error("Failed to load warranty supplier", error);

      setRows([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchWarranty();

  }, [siteId]);

  return (
    <div className="flex justify-center-safe py-[39px] px-[39px] w-full h-auto">

      <div className="w-full">

        {loading && (
          <div className="text-gray-400 text-sm mb-3">
            Loading...
          </div>
        )}

        <WarrantyTable data={rows} />

      </div>

    </div>
  );
}