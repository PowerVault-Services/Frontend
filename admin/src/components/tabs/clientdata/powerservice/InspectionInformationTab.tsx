import DocumentIcon from "../../../../assets/icons/Document.svg";
import { useEffect, useState } from "react";
import { getProjectDetail } from "../../../../services/client.api";

export default function InspectionInformationTab() {

    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const siteIdStr = localStorage.getItem("siteId");
                if (!siteIdStr) return;

                const siteId = Number(siteIdStr);

                const res = await getProjectDetail(siteId);

                setData(res);

            } catch (err) {
                console.error("โหลด project ไม่สำเร็จ", err);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="flex justify-center-safe py-[51px] px-8 w-full h-auto">
            <div className="pr-3">

                {/* Image */}
                <div className="w-[700px] h-96 rounded-xl overflow-hidden mb-[41px]">
                    <img
                        src={
                            data?.imageUrl
                                ? "http://localhost:3000" + data.imageUrl
                                : "https://powervaultthailand.com/wp-content/uploads/2025/01/UNIQUE-PLASTIC-INDUSTRY.jpg"
                        }
                        alt="solar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Map */}
                <div className="w-[700px] h-60 rounded-xl overflow-hidden">
                    <iframe
                        className="w-full h-full"
                        loading="lazy"
                        src={
                            data?.latitude && data?.longitude
                                ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}&output=embed`
                                : "https://www.google.com/maps?q=13.7563,100.5018&output=embed"
                        }
                    />
                </div>

            </div>

            <div className="flex flex-col justify-between">

                {/* Company Info */}
                <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

                    <p>Description</p>
                    <p>Company : {data?.company || "-"}</p>
                    <p>Address : {data?.address || "-"}</p>
                    <p>Location : {data?.province || "-"}</p>
                    <p>Type : {data?.epcPPA || "-"}</p>
                    <p>O&amp;M : {data?.om || "-"}</p>
                    <p>Solar Panel : {data?.panelBrand || "-"}</p>
                    <p>Panel Brand : {data?.panelBrand || "-"}</p>
                    <p>ขนาดแผง (W) : {data?.panelPowerW || "-"}</p>
                    <p>Inverter (ea) : {data?.inverterCount || "-"}</p>
                    <p>Inverter Brand : {data?.inverterBrand || "-"}</p>
                    <p>เงื่อนไขเข้างาน : {data?.condition || "-"}</p>
                    <p>Remark : {data?.remark || "-"}</p>

                </div>

                {/* Contact Info */}
                <div className="flex flex-col justify-between p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

                    <div>
                        <p>Customer Contact E-mail : {data?.email || "-"}</p>
                        <p>Tel : {data?.tel || "-"}</p>
                    </div>

                </div>

                {/* Button doc */}
                <div className="flex justify-end">
                    <button className="flex text-white text-sm font-normal bg-green-600 px-6 py-2.5 gap-5 rounded-md">
                        <img src={DocumentIcon} alt="docicon" />
                        Document
                    </button>
                </div>

            </div>
        </div>
    );
}