import DocumentIcon from "../../../../assets/icons/Document.svg";

type Project = any;

interface Props {
  project: Project;
}

export default function CleaningInformationTab({ project }: Props) {
  const BASE_URL = import.meta.env.VITE_API_URL || "";
  const API_ROOT = BASE_URL.replace("/api", "");

  const imageUrl = project.siteImageUrl
  ? `${API_ROOT}${project.siteImageUrl}`
  : "fallback-url";

console.log("CLEANING PROJECT OBJECT:", project);
console.log("CLEANING IMAGE URL:", imageUrl);

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
            src={
              project?.latitude && project?.longitude
                ? `https://www.google.com/maps?q=${project.latitude},${project.longitude}&output=embed`
                : "https://www.google.com/maps?q=13.7563,100.5018&output=embed"
            }
          />
        </div>
      </div>

      <div className="flex flex-col justify-between">

        {/* Company Info */}
        <div className="flex flex-col gap-1 w-[740px] p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">

          <p>Description : {project?.name ?? "-"}</p>
          <p>Company : {project?.company || "-"}</p>
          <p>Address : {project?.address || "-"}</p>
          <p>Location : {project?.province || "-"}</p>
          <p>Type : {project?.epcPPA || "-"}</p>
          <p>O&amp;M : {project?.om || "-"}</p>
          <p>Solar Panel : {project?.panelBrand || "-"}</p>
          <p>Panel Brand : {project?.panelBrand || "-"}</p>
          <p>ขนาดแผง (W) : {project?.panelPowerW || "-"}</p>
          <p>เงื่อนไขเข้างาน : {project?.condition || "-"}</p>
          <p>Remark : {project?.remark || "-"}</p>

        </div>

        {/* Contact Info */}
        <div className="flex flex-col p-[19px_17px] border border-green-800 rounded-2xl text-[16px]">
          <p>Customer Contact E-mail : {project?.email || "-"}</p>
          <p>Tel : {project?.tel || "-"}</p>
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <button className="flex text-white text-sm bg-green-600 px-6 py-2.5 gap-5 rounded-md">
            <img src={DocumentIcon} alt="docicon" />
            Document
          </button>
        </div>

      </div>
    </div>
  );
}