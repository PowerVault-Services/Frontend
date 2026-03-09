import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";
import Pagination from "../table/Pagination";

import { JOB_CONFIG } from "../../configs/jobConfig";
import {
  getServiceEntries,
  deleteServiceEntry
} from "../../services/client.api";

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
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    projectNo: "",
    projectName: "",
    systemSize: "",
    job: "all",
  });

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  /* ================= Fetch API ================= */

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await getServiceEntries({
        job: filters.job !== "all" ? filters.job : undefined,
        projectNo: filters.projectNo || undefined,
        projectName: filters.projectName || undefined,
        systemSizeKWp: filters.systemSize
          ? Number(filters.systemSize)
          : undefined,
        page,
        pageSize,
      });

      console.log("SERVICE API", res);

      const items = res?.data?.items ?? [];
      const totalCount = res?.data?.total ?? 0;

      const mapped: PowerVaultService[] = items.map((item: any) => ({
        id: String(item.entryId),
        projectnumber: item.projectNo ?? "-",
        projectName: item.projectName ?? "-",
        systemSize: item.systemSizeKWp ?? 0,
        job: item.job as JobType,
        description: item.description ?? "",
      }));

      setData(mapped);
      setTotal(totalCount);
    } catch (error) {
      console.error("Error loading service entries", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, page]);

  const goToJobPage = (row: PowerVaultService) => {
    navigate(`/project/${row.projectnumber}/${jobToSlug(row.job)}`);
  };

  const handleDelete = async (id: string) => {

    const confirmDelete = confirm("Delete this entry?");

    if (!confirmDelete) return;

    try {

      await deleteServiceEntry(Number(id));

      fetchData(); // reload table

    } catch (error) {

      console.error("Delete failed", error);

    }
  };

  /* ================= Badge Style ================= */

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

  /* ================= Table Columns ================= */

  const columns: Column<PowerVaultService>[] = [
    {
      id: "projectNo",
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
      id: "projectName",
      key: "projectName",
      label: "Project Name",
      align: "center",
    },
    {
      id: "systemSize",
      key: "systemSize",
      label: "System Size (kWp)",
      align: "center",
    },
    {
      id: "job",
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
      id: "description",
      key: "description",
      label: "Description",
      align: "center",
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (_, row) => (
        <div className="flex justify-center gap-3">

          {/* EDIT */}
          <button
            onClick={() =>
              navigate(`/service/edit/${row.id}`)
            }
            className="text-blue-600 hover:text-blue-800"
          >
            ✏️
          </button>

          {/* DELETE */}
          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
          >
            🗑
          </button>

        </div>
      ),
    }
  ];

  return (
    <div className="flex flex-col gap-[18px]">
      {/* ================= Filter ================= */}

      <SearchBox>
        <div className="grid grid-cols-4 gap-2.5">
          <TextInputFilter
            label="Project No."
            value={filters.projectNo}
            onChange={(value) => {
              setPage(1);
              setFilters({ ...filters, projectNo: value });
            }}
          />

          <TextInputFilter
            label="Project Name"
            value={filters.projectName}
            onChange={(value) => {
              setPage(1);
              setFilters({ ...filters, projectName: value });
            }}
          />

          <TextInputFilter
            label="System Size (kWp)"
            value={filters.systemSize}
            onChange={(value) => {
              setPage(1);
              setFilters({ ...filters, systemSize: value });
            }}
          />

          <SelectFilter
            label="Job"
            placeholder="All"
            value={filters.job}
            onChange={(value) => {
              setPage(1);
              setFilters({ ...filters, job: value });
            }}
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

      {/* ================= Table ================= */}

      <div className="pt-[25px]">
        <DataTable<PowerVaultService>
          columns={columns}
          data={data}
          loading={loading}
        />

        {/* ================= Pagination ================= */}

        <div className="flex items-center justify-between py-6 text-sm text-gray-500">
          <span>
            {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, total)} of {total} items
          </span>

          <Pagination
            page={page}
            totalPages={Math.ceil(total / pageSize)}
            onChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}