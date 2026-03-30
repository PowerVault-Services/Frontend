import DocumentIcon from "../../../assets/icons/Document.svg";

interface Props {
  project: any;
}

export default function InformationTab({ project }: Props) {

  if (!project) {
    return <div className="p-10 text-gray-400">No project data</div>;
  }

  const mapUrl =
    project.latitude && project.longitude
      ? `https://www.google.com/maps?q=${project.latitude},${project.longitude}&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(project.address)}&output=embed`;

  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const API_ROOT = BASE_URL.replace("/api", "");

  const imageUrl = project.siteImageUrl
    ? `${API_ROOT}${project.siteImageUrl}`
    : "fallback-url";

  console.log("BASE_URL:", BASE_URL);
  console.log("API_ROOT:", API_ROOT);
  console.log("siteImageUrl:", project.siteImageUrl);
  console.log("FINAL IMAGE URL:", imageUrl);
  console.log("INFO PROJECT OBJECT:", project);
  return (
    <div className="flex justify-center-safe py-[51px] px-8 w-full h-auto">

      {/* LEFT SIDE */}
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
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          />
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-between">

        {/* Company Info */}
        <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <p>Company : {project.companyName ?? project.name ?? "-"}</p>

          <p>Address : {project.address ?? "-"}</p>

          <p>
            Location :{" "}
            {project.latitude && project.longitude
              ? `${project.latitude}, ${project.longitude} `
              : "-"}
          </p>

          <p>EPC/PPA : {project.ecpPpa ?? "-"}</p>

          <p>Type : {project.projectTypeText ?? "-"}</p>

          <p>Free O&M : {project.freeOmText ?? "-"}</p>

          <p>Warranty Output (%) : {project.warrantyOutputPct ?? "-"}</p>

          <p>
            COD Date :{" "}
            {project.codDate
              ? new Date(project.codDate).toLocaleDateString("th-TH")
              : "-"}
          </p>

        </div>

        {/* Solar Info */}
        <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <p>Solar Panel : {project.panelBrand ?? "-"}</p>

          <p>Panel Brand : {project.panelBrand ?? "-"}</p>

          <p>ขนาดแผง (W) : {project.panelWatt ?? "-"}</p>

          <p>Sale : {project.salePerson ?? "-"}</p>

          <p>Site Engineer : {project.siteEngineer ?? "-"}</p>

          <p>ผู้รับเหมาติดตั้ง : {project.installationContractor ?? "-"}</p>

          <p>เงื่อนไขงาน : {project.workEntryConditions ?? "-"}</p>

        </div>

        {/* Contact Info */}
        <div className="flex flex-col justify-between p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <div>
            <p>Customer Contact E-mail : {project.contactEmail ?? "-"}</p>
            <p>Tel : {project.contactPhone ?? "-"}</p>
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