import { useEffect, useState } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
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
                    setImageUrl(`http://localhost:3000${layout.fileUrl}`);
                }
            } catch (err) {
                console.error("โหลด layout ไม่สำเร็จ", err);
            }
        };

        fetchLayout();
    }, [siteId, type]);

    return (
        <div className="flex justify-center py-[51px] px-8 w-full h-auto min-h-[400px]">
            {imageUrl ? (
                <Zoom>
                    <img
                        src={imageUrl}
                        alt={type}
                        className="max-w-full h-auto object-contain cursor-zoom-in rounded-lg"
                    />
                </Zoom>
            ) : (
                "No image"
            )}
        </div>
    );
}