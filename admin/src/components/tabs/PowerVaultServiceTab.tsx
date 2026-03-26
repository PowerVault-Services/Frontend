import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../SearchBox";
import TextInputFilter from "../TextInputFilter";
import SelectFilter from "../SelectFilter";
import DataTable, { type Column } from "../table/DataTable";
import Pagination from "../table/Pagination";

import EditIcon from "../../assets/icons/Pen New Square.svg";
import DeleteIcon from "../../assets/icons/Paper Bin.svg";

import { JOB_CONFIG } from "../../configs/jobConfig";
import {
  getServiceEntries,
  deleteServiceEntry
} from "../../services/client.api";

type JobType = "SERVICE" | "CLEANING" | "INSPECTION" | "OM";

interface PowerVaultService {
  id: string;
  siteId: number;
  projectnumber: string;
  projectName: string;
  systemSize: number;
  job: JobType;
  description: string;
  endWarranty?: string;
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

      const items = res?.items ?? [];
      const totalCount = res?.total ?? 0;

      const mapped: PowerVaultService[] = items.map((item: any) => ({
        id: String(item.entryId),
        siteId: item.siteId, // ✅ เพิ่มบรรทัดนี้
        projectnumber: item.projectNo ?? "-",
        projectName: item.projectName ?? "-",
        systemSize: Number(item.systemSizeKWp) || 0,
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
  }, [filters, page, pageSize]);

  const goToJobPage = (row: PowerVaultService) => {
    navigate(`/project/${row.siteId}/${jobToSlug(row.job)}`, {
      state: {
        projectName: row.projectName,
        systemSizeKWp: row.systemSize,
        endWarranty: row.endWarranty,
      },
    });
  };

  /* ================= Delete ================= */
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("ต้องการลบรายการนี้หรือไม่?");
    if (!confirmDelete) return;

    try {
      await deleteServiceEntry(id);
      alert("ลบสำเร็จ");
      window.location.reload(); // หรือ refetch จะดีกว่า
    } catch (err) {
      alert("ลบไม่สำเร็จ");
    }
  };

  const handleEdit = (row: PowerVaultService) => {
    navigate(`/project/edit/${row.siteId}`);
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
      render: (value, row) => {
        const raw = String(value ?? "");
        const displayValue = raw.replace(/^NE=/, "");

        return (
          <button
            onClick={() => goToJobPage(row)}
            className="text-green-800 underline hover:text-green-900"
          >
            {displayValue}
          </button>
        );
      },
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
      render: (value) => {
        const key = value as keyof typeof JOB_CONFIG;

        return (
          <span
            className={`
        inline-flex items-center justify-center
        px-4 py-1 rounded-full
        text-sm font-medium w-[119px]
        ${jobBadgeClass(value)}
      `}
          >
            {JOB_CONFIG[key]?.label ?? value}
          </span>
        );
      },
    },
    {
      id: "description",
      key: "description",
      label: "Description",
      align: "center",
    },
    {
      id: "actions",
      key: "siteId",
      label: "Actions",
      align: "center",
      render: (_, row) => (
        <div className="flex items-center gap-3 justify-center">
          <button onClick={() => handleEdit(row)} className="hover:opacity-70 transition-opacity" title="Edit">
            <img src={EditIcon} alt="Edit" className="w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(row.siteId)} className="hover:opacity-70 transition-opacity" title="Delete">
            <img src={DeleteIcon} alt="Delete" className="w-5 h-5" />
          </button>
        </div>
      )
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