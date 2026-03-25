import DocumentIcon from "../../../../assets/icons/Document.svg";

interface Props {
  project: any;
}

export default function CleaningInformationTab({ project }: Props) {

  // ✅ หา PV_LAYOUT จาก DB
  const layout = project?.layouts?.find(
    (l: any) => l.type === "PV_LAYOUT"
  );

  const imageUrl = layout?.fileUrl
    ? "http://localhost:3000" + layout.fileUrl
    : "https://powervaultthailand.com/wp-content/uploads/2025/01/UNIQUE-PLASTIC-INDUSTRY.jpg";

  return (
    <div className="flex justify-center-safe py-[51px] px-8 w-full h-auto">
      <div className="pr-3">

        {/* Image */}
        <div className="w-[700px] h-96 rounded-xl overflow-hidden mb-[41px]">
          <img
            src={imageUrl}
            alt="solar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Map */}
        <div className="w-[700px] h-60 rounded-xl overflow-hidden">
          <iframe
            className="w-full h-full"
            loading="lazy"
            src={`https://www.google.com/maps?q=${project?.latitude ?? 13.7563},${project?.longitude ?? 100.5018}&output=embed`}
          />
        </div>

      </div>

      <div className="flex flex-col justify-between">

        {/* Company Info */}
        <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <p>Description: {project?.projectName ?? "-"}</p>
          <p>Company : {project?.company ?? "-"}</p>
          <p>Address : {project?.address ?? "-"}</p>
          <p>Location : {project?.province ?? "-"}</p>
          <p>Type : {project?.epcPPA ?? "-"}</p>
          <p>O&M : {project?.om ?? "-"}</p>
          <p>Solar Panel : {project?.panelBrand ?? "-"}</p>
          <p>Panel Brand : {project?.panelBrand ?? "-"}</p>
          <p>ขนาดแผง (W) : {project?.panelPowerW ?? "-"}</p>
          <p>หมดรับประกันอุปกรณ์ : {project?.endWarranty ?? "-"}</p>
          <p>เงื่อนไขเข้างาน : {project?.condition ?? "-"}</p>
          <p>Remark : {project?.remark ?? "-"}</p>

        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-between p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">
          <div>
            <p>Customer Contact E-mail : {project?.email ?? "-"}</p>
            <p>Tel : {project?.tel ?? "-"}</p>
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