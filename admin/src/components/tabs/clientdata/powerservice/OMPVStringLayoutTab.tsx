import { useEffect, useState } from "react";
import { getProjectDetail } from "../../../../services/client.api";

interface Props {
  siteId: number;
  type: string;
}

export default function OMPVStringLayoutTab({ siteId, type }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!siteId) return;

    async function fetchLayout() {
      try {
        const data = await getProjectDetail(siteId);

        const layouts = data.layouts || [];

        const layout = layouts.find(
          (l: { type: string }) => l.type === type
        );

        if (layout?.fileUrl) {
          setImageUrl(`${import.meta.env.VITE_API_URL}${layout.fileUrl}`);
        } else {
          setImageUrl(null);
        }
      } catch (err) {
        console.error("โหลด PV String Layout ไม่สำเร็จ", err);
        setImageUrl(null);
      }
    }

    fetchLayout();
  }, [siteId, type]);

  return (
    <div className="flex justify-center-safe py-[51px] px-8 w-full h-auto">
      <div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="PV String Layout"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-gray-400">ไม่มีรูป PV String Layout</span>
        )}
      </div>
    </div>
  );
}