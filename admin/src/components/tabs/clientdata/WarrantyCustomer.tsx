import { useEffect, useState } from "react";
import WarrantyTable from "../../table/WarrantyTable";
import { getProjectDetail } from "../../../services/client.api";

interface Props {
  siteId?: number;
}

export default function WarrantyCustomer({ siteId }: Props) {

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

      // 🔥 จุดสำคัญ
      const items = res?.warrantyCustomerItems ?? [];

      setRows(items);

    } catch (error) {
      console.error(error);
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

        {loading && <div>Loading...</div>}

        <WarrantyTable data={rows} />

      </div>
    </div>
  );
}