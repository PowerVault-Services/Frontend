import { useEffect, useState } from "react";
import { getProjectDetail } from "../../../services/client.api";

interface Props {
  siteId: number;
  type: "PV_LAYOUT" | "PV_STRING_LAYOUT";
}

export default function LayoutImageTab({ siteId, type }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const data = await getProjectDetail(siteId);

        const layouts = data.layouts || [];

        const layout = layouts.find((l: any) => l.type === type);

        if (layout?.fileUrl) {
          setImageUrl("http://localhost:3000" + layout.fileUrl);
        }
      } catch (err) {
        console.error("โหลด layout ไม่สำเร็จ", err);
      }
    };

    fetchLayout();
  }, [siteId, type]);

  return (
    <div className="flex justify-center py-[51px] px-8 w-full h-auto">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={type}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        "No image"
      )}
    </div>
  );
}