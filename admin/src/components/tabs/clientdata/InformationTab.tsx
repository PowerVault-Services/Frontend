import DocumentIcon from "../../../assets/icons/Document.svg";

interface Props {
  project: any;
}

export default function InformationTab({ project }: Props) {

  if (!project) {
    return <div className="p-10 text-gray-400">No project data</div>;
  }

  return (
    <div className="flex justify-center-safe py-[51px] px-8 w-full h-auto">

      {/* LEFT SIDE */}
      <div className="pr-3">

        {/* Image */}
        <div className="w-[700px] h-96 rounded-xl overflow-hidden mb-[41px]">
          <img
            src={
              project.imageUrl ??
              "https://powervaultthailand.com/wp-content/uploads/2025/01/UNIQUE-PLASTIC-INDUSTRY.jpg"
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
            src={`https://www.google.com/maps?q=${project.lat ?? 13.7563},${project.lng ?? 100.5018}&output=embed`}
          />
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-between">

        {/* Company Info */}
        <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <p>Company : {project.company ?? "-"}</p>

          <p>Address : {project.address ?? "-"}</p>

          <p>Location : {project.location ?? "-"}</p>

          <p>EPC/PPA : {project.epcPPA ?? "-"}</p>

          <p>Type : {project.type ?? "-"}</p>

          <p>Free O&M : {project.freeOM ?? "-"}</p>

          <p>Warranty Output (%) : {project.warrantyOutput ?? "-"}</p>

          <p>COD Date : {project.codDate ?? "-"}</p>

        </div>

        {/* Solar Info */}
        <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <p>Solar Panel : {project.panelBrand ?? "-"}</p>
          <p>Panel Brand : {project.panelBrand ?? "-"}</p>

          <p>ขนาดแผง (W) : {project.panelPowerW ?? "-"}</p>
          <p>Sale : {project.sale ?? "-"}</p>
          <p>Site Engineer : {project.siteEngineer ?? "-"}</p>
          <p>ผู้รับเหมาติดตั้ง : {project.installer ?? "-"}</p>
          <p>เงื่อนไขงาน : {project.conditions ?? "-"}</p>

        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-between p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <div>

            <p>Customer Contact E-mail : {" "}
              {project.contactEmail ?? "-"}
            </p>

            <p>Tel : {" "}
              {project.contactPhone ?? "-"}
            </p>

          </div>

        </div>

        {/* Document Button */}
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