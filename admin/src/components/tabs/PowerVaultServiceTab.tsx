import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS, type JobType } from "../../mock/project";
import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";
import { JOB_CONFIG } from "../../configs/jobConfig";

interface PowerVaultService {
  id: string;
  projectnumber: string;
  projectName: string;
  systemSize: number;
  job: JobType;
  description: string;
}

const jobToSlug = (job: JobType) => {
  switch (job) {
    case "Service":
      return "service";
    case "Cleaning":
      return "cleaning";
    case "Inspection":
      return "inspection";
    case "OM":
      return "om";
  }
};

export default function PowerVaultServiceTab() {
  const [data, setData] = useState<PowerVaultService[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tableData: PowerVaultService[] = PROJECTS.flatMap((project) =>
      project.jobs.map((j) => ({
        id: `${project.id}_${j.job}`,
        projectnumber: project.id,
        projectName: project.name,
        systemSize: project.systemSize,
        job: j.job,
        description: j.description,
      }))
    );

    setData(tableData);
    setLoading(false);
  }, []);

  const goToJobPage = (row: PowerVaultService) => {
    navigate(`/project/${row.projectnumber}/${jobToSlug(row.job)}`);
  };

  const jobBadgeClass = (job: JobType) => {
    switch (job) {
      case "Service":
        return "bg-sky-100 text-sky-700";
      case "Cleaning":
        return "bg-purple-100 text-purple-700";
      case "Inspection":
        return "bg-pink-100 text-pink-700";
      case "OM":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const columns: Column<PowerVaultService>[] = [
    {
      key: "projectnumber",
      label: "Project No.",
      align: "center",
      render: (value, row) => (
        <button
          onClick={() => goToJobPage(row)}
          className="text-green-800 underline hover:text-green-900"
        >
          {value}
        </button>
      ),
    },
    {
      key: "projectName",
      label: "Project Name",
      align: "center",
    },
    {
      key: "systemSize",
      label: "System Size (kWp)",
      align: "center",
    },
    {
      key: "job",
      label: "Job",
      align: "center",
      render: (value) => (
        <span
          className={`
            inline-flex items-center justify-center
            px-4 py-1 rounded-full
            text-sm font-medium w-[119px]
            ${jobBadgeClass(value)}
          `}
        >
          {JOB_CONFIG[value as JobType].label}
        </span>
      ),
    },
    {
      key: "description",
      label: "Description",
      align: "center",
    },
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      <SearchBox>
        <div className="grid grid-cols-4 gap-2.5">
          <TextInputFilter label="Project No." value="" onChange={() => {}} />
          <TextInputFilter label="Project Name" value="" onChange={() => {}} />
          <SelectFilter
            label="Job"
            placeholder="All"
            value=""
            onChange={() => {}}
            options={[
              { label: "All", value: "all" },
              { label: "Service", value: "Service" },
              { label: "Cleaning", value: "Cleaning" },
              { label: "Inspection", value: "Inspection" },
              { label: "O&M", value: "OM" },
            ]}
          />
        </div>
      </SearchBox>

      <div className="pt-[25px]">
        <DataTable columns={columns} data={data} loading={loading} />
      </div>
    </div>
  );
}
