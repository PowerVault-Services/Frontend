import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";
import { JOB_CONFIG } from "../../configs/jobConfig";
import { getServiceEntries } from "../../services/client.api";

type JobType = "SERVICE" | "CLEANING" | "INSPECTION" | "OM";

interface PowerVaultService {
  id: string;
  projectnumber: string;
  projectName: string;
  systemSize: number;
  job: JobType;
  description: string;
}

const jobToSlug = (job: string) => job.toLowerCase();

export default function PowerVaultServiceTab() {
  const [data, setData] = useState<PowerVaultService[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    projectNo: "",
    projectName: "",
    systemSize: "",
    job: "all",
  });

  const navigate = useNavigate();

  /* ================= Fetch API ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getServiceEntries(
          filters.job !== "all" ? filters.job : undefined
        );

        console.log("SERVICE API:", res.data);

        // รองรับหลายรูปแบบ response
        const apiData =
          res?.data?.data ??
          res?.data ??
          [];

        if (Array.isArray(apiData)) {
          const mapped: PowerVaultService[] = apiData.map((item: any) => ({
            id: String(item.id),
            projectnumber: String(item.siteId),
            projectName: item.projectName ?? "-",
            systemSize: item.systemSize ?? 0,
            job: item.job as JobType,
            description: item.description ?? "",
          }));

          setData(mapped);
        } else {
          setData([]);
        }

      } catch (error) {
        console.error("Error loading service entries:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.job]);

  const goToJobPage = (row: PowerVaultService) => {
    navigate(`/project/${row.projectnumber}/${jobToSlug(row.job)}`);
  };

  /* ================= Filtered Data ================= */
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchProjectNo =
        filters.projectNo === "" ||
        item.projectnumber
          .toLowerCase()
          .includes(filters.projectNo.toLowerCase());

      const matchProjectName =
        filters.projectName === "" ||
        item.projectName
          .toLowerCase()
          .includes(filters.projectName.toLowerCase());

      const matchSystemSize =
        filters.systemSize === "" ||
        item.systemSize === Number(filters.systemSize);

      const matchJob =
        filters.job === "all" || item.job === filters.job;

      return (
        matchProjectNo &&
        matchProjectName &&
        matchSystemSize &&
        matchJob
      );
    });
  }, [data, filters]);

  const jobBadgeClass = (job: string) => {
    switch (job) {
      case "SERVICE":
        return "bg-sky-100 text-sky-700";
      case "CLEANING":
        return "bg-purple-100 text-purple-700";
      case "INSPECTION":
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

          {JOB_CONFIG[value as JobType]?.label ?? value}
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
          <TextInputFilter
            label="Project No."
            value={filters.projectNo}
            onChange={(value) =>
              setFilters({ ...filters, projectNo: value })
            }
          />

          <TextInputFilter
            label="Project Name"
            value={filters.projectName}
            onChange={(value) =>
              setFilters({ ...filters, projectName: value })
            }
          />

          <TextInputFilter
            label="System Size (kWp)"
            value={filters.systemSize}
            onChange={(value) =>
              setFilters({ ...filters, systemSize: value })
            }
          />

          <SelectFilter
            label="Job"
            placeholder="All"
            value={filters.job}
            onChange={(value) =>
              setFilters({ ...filters, job: value })
            }
            options={[
              { label: "All", value: "all" },
              { label: "Service", value: "SERVICE" },
              { label: "Cleaning", value: "CLEANING" },
              { label: "Inspection", value: "INSPECTION" },
              { label: "O&M", value: "OM" },
            ]}
          />
        </div>
      </SearchBox>

      <div className="pt-[25px]">
        <DataTable
          columns={columns}
          data={Array.isArray(filteredData) ? filteredData : []}
          loading={loading}
        />
      </div>
    </div>
  );
}