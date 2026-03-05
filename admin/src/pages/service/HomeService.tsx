import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ZipIcon from "../../assets/icons/ZIP File.svg";
import AddIcon from "../../assets/icons/Add Circle.svg";
import DataTable, { type Column } from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";

interface Service {
  id: number;
  jobnumber: string;
  projectType: string;
  projectName: string;
  systemSize: number;
  date: string;
  time: string;
  status: string;
}

export default function HomeService() {

  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [page, setPage] = useState(1);
  const pageSize = 13;

  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / pageSize);

  // filters
  const [jobNo, setJobNo] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectName, setProjectName] = useState("");
  const [systemSize, setSystemSize] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {

      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });

        if (jobNo) params.append("jobNo", jobNo);
        if (projectType && projectType !== "all")
          params.append("projectType", projectType);
        if (projectName) params.append("projectName", projectName);
        if (systemSize) params.append("systemSizeKWp", systemSize);
        if (date) params.append("date", date);
        if (status && status !== "all")
          params.append("status", status);

        const res = await fetch(`/api/service/jobs?${params.toString()}`);
        const json = await res.json();

        if (!json.success) return;

        const mapped = json.data.map((item: any) => ({
          id: item.jobId,
          jobnumber: item.jobNo,
          projectType: item.projectType,
          projectName: item.projectName,
          systemSize: item.systemSizeKWp,
          date: item.date?.slice(0, 10),
          time: item.time,
          status: item.status,
        }));

        setData(mapped);
        setTotalItems(json.pagination.total);

      } catch (err) {
        console.error("load service jobs error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();

  }, [page, jobNo, projectType, projectName, systemSize, date, status]);

  const handleEdit = (row: Service) => {
    console.log("edit", row);
  };

  const handleDelete = (id: number) => {

    if (!confirm("Delete this record?")) return;

    setData((prev) => prev.filter((r) => r.id !== id));

    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  };

  const columns: Column<Service>[] = [

    {
      id: "checkbox",
      label: "",
      align: "center",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={() => {
            const next = new Set(selectedRows);
            next.has(row.id) ? next.delete(row.id) : next.add(row.id);
            setSelectedRows(next);
          }}
        />
      ),
    },

    { id: "jobnumber", key: "jobnumber", label: "Job No.", align: "center" },

    { id: "projectType", key: "projectType", label: "Project Type", align: "center" },

    { id: "projectName", key: "projectName", label: "Project Name", align: "center" },

    { id: "systemSize", key: "systemSize", label: "System Size (kWp)", align: "center" },

    { id: "date", key: "date", label: "Date", align: "center" },

    { id: "time", key: "time", label: "Time", align: "center" },

    {
      id: "status",
      key: "status",
      label: "Status",
      align: "center",
      render: (value) => {

        const map: any = {
          DRAFT: "bg-gray-200 text-gray-700",
          ASSIGNED: "bg-blue-100 text-blue-700",
          COMPLETED: "bg-green-100 text-green-700",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${map[value] || "bg-gray-100"
              }`}
          >
            {value}
          </span>
        );
      },
    },

    {
      id: "actions",
      label: "Actions",
      align: "center",
      render: (_, row) => (
        <div className="flex justify-center gap-3">

          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            ✏️
          </button>

          <button
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:text-red-800"
          >
            🗑
          </button>

        </div>
      ),
    },
  ];

  return (

    <div className="w-full">

      <div className="flex justify-between pb-9">

        <h1 className="text-green-800">Service</h1>

        <Link to="/service/new/step1">

          <button className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5">

            <img src={AddIcon} alt="" />

            New Service Job

          </button>

        </Link>

      </div>

      <SearchBox>

        <div className="grid grid-cols-4 justify-between gap-2.5">

          <TextInputFilter
            label="Job No."
            value={jobNo}
            onChange={(value) => setJobNo(value)}
          />

          <SelectFilter
            label="Project Type"
            placeholder="All"
            value={projectType}
            onChange={(value) => setProjectType(value)}
            options={[
              { label: "All", value: "all" },
              { label: "Solar Farm", value: "Solar Farm" },
              { label: "Factory", value: "Factory" },
            ]}
          />

          <TextInputFilter
            label="Project Name"
            value={projectName}
            onChange={(value) => setProjectName(value)}
          />

          <TextInputFilter
            label="System Size (kWp)"
            value={systemSize}
            onChange={(value) => setSystemSize(value)}
          />

          <TextInputFilter
            label="Date"
            type="date"
            value={date}
            onChange={(value) => setDate(value)}
          />

          <SelectFilter
            label="Status"
            placeholder="All"
            value={status}
            onChange={(value) => setStatus(value)}
            options={[
              { label: "All", value: "all" },
              { label: "Draft", value: "DRAFT" },
              { label: "Assigned", value: "ASSIGNED" },
              { label: "Completed", value: "COMPLETED" },
            ]}
          />

        </div>

      </SearchBox>

      <div className="flex justify-end mt-[65px]">

        <button className="flex items-center px-7 py-3 gap-1.5 bg-white shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-2 border-green-700 rounded-md text-xs text-green-700 font-normal">

          <img src={ZipIcon} alt="" />

          ดาวน์โหลด zip file ({selectedRows.size})

        </button>

      </div>

      <div className="pt-[25px]">

        <DataTable<Service>

          columns={columns}

          data={data}

          loading={loading}

        />

      </div>

      <div className="flex items-center justify-between py-6 text-sm text-gray-500">

        <span>

          {(page - 1) * pageSize + 1} to{" "}

          {Math.min(page * pageSize, totalItems)} of {totalItems} items

        </span>

        <Pagination

          page={page}

          totalPages={totalPages}

          onChange={setPage}

        />

      </div>

    </div>
  );
}