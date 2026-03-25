import { useEffect, useState } from "react";
import { getProjectDetail } from "../../../../services/client.api";


export default function InspectionPVStringLayoutTab() {

    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLayout() {
            try {
                const siteIdStr = localStorage.getItem("siteId");
                if (!siteIdStr) return;

                const siteId = Number(siteIdStr);

                const data = await getProjectDetail(siteId);

                const layouts = data.layouts || [];

                const layout = layouts.find(
                    (l: { type: string }) => l.type === "PV_STRING_LAYOUT"
                );

                if (layout?.fileUrl) {
                    setImageUrl("http://localhost:3000" + layout.fileUrl);
                }

            } catch (err) {
                console.error("โหลด PV String Layout ไม่สำเร็จ", err);
            }
        }

        fetchLayout();
    }, []);

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
                    "img"
                )}
            </div>
        </div>
    );
}