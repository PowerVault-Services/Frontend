import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ZipIcon from "../../assets/icons/ZIP File.svg";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import DataTable, { type Column } from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";

interface Service {
  id: number;
  jobnumber: string;
  projectType: string;
  projectName: string;
  systemSize: number;
  pvModuleEA?: number;
  date: string;
  time: string;
  status: string;
}

export default function HomeService() {

  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(1);
  const pageSize = 13;

  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / pageSize);

  const allSelected = data.length > 0 && selectedRows.size === data.length;

  const partiallySelected =
    selectedRows.size > 0 && selectedRows.size < data.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  // filters
  const [jobNo, setJobNo] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectName, setProjectName] = useState("");
  const [systemSize, setSystemSize] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  // reset page เมื่อ filter เปลี่ยน
  useEffect(() => {
    setPage(1);
  }, [jobNo, projectType, projectName, systemSize, date, status]);

  useEffect(() => {
    fetchServiceJobs();
  }, [page, jobNo, projectType, projectName, systemSize, date, status]);

  const fetchServiceJobs = async () => {

    try {

      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });

      if (jobNo) params.append("jobNo", jobNo);
      if (projectType) params.append("projectType", projectType);
      if (projectName) params.append("projectName", projectName);
      if (systemSize) params.append("systemSizeKWp", systemSize);
      if (date) params.append("date", date);
      if (status) params.append("status", status);

      const res = await fetch(`/api/service/jobs?${params.toString()}`);
      const json = await res.json();

      if (!json.success) return;

      const list = json.data ?? [];

      const mapped: Service[] = list.map((item: any) => ({
        id: item.jobId,
        jobnumber: item.jobNo,
        projectType: item.projectType,
        projectName: item.projectName,
        systemSize: item.systemSizeKWp,
        pvModuleEA: item.pvModuleEA,
        date: item.date?.slice(0, 10),
        time: item.time,
        status: item.status
      }));

      setData(mapped);
      setTotalItems(json.pagination?.total ?? 0);

      setSelectedRows(new Set());

    } catch (err) {

      console.error("โหลด Service Jobs ไม่สำเร็จ:", err);

    } finally {

      setLoading(false);

    }

  };

  const handleEdit = (row: Service) => {
    console.log("Edit:", row);
  };

  const handleDelete = (id: number) => {

    if (!confirm("Delete this record?")) return;

    setData(prev => prev.filter(r => r.id !== id));

    setSelectedRows(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

  };

  const statusBadge = (status: string) => {

    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (status) {

      case "COMPLETED":
        return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;

      case "ASSIGNED":
        return <span className={`${base} bg-blue-100 text-blue-700`}>Assigned</span>;

      case "IN_PROGRESS":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>In Progress</span>;

      case "DRAFT":
        return <span className={`${base} bg-gray-200 text-gray-700`}>Draft</span>;

      case "CANCELLED":
        return <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>;

      default:
        return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
    }

  };

  const columns: Column<Service>[] = [

    {
      id: "checkbox",
      label: (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={(e) => {

            const checked = e.target.checked;

            if (checked) {
              setSelectedRows(new Set(data.map(r => r.id)));
            } else {
              setSelectedRows(new Set());
            }

          }}
        />
      ),
      align: "center",
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={(e) => {

            const checked = e.target.checked;

            setSelectedRows(prev => {

              const next = new Set(prev);

              checked ? next.add(row.id) : next.delete(row.id);

              return next;

            });

          }}
        />
      )
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
      render: (value) => statusBadge(value)
    },

    {
      id: "actions",
      key: "id",
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
      )
    }

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

          <TextInputFilter label="Job No." value={jobNo} onChange={setJobNo} />

          <SelectFilter
            label="Project Type"
            placeholder="All"
            value={projectType}
            onChange={setProjectType}
            options={[
              { label: "All", value: "" },
              { label: "Solar Farm", value: "Solar Farm" },
              { label: "Factory", value: "Factory" }
            ]}
          />

          <TextInputFilter label="Project Name" value={projectName} onChange={setProjectName} />

          <TextInputFilter label="System Size (kWp)" value={systemSize} onChange={setSystemSize} />

          <TextInputFilter label="Date" type="date" value={date} onChange={setDate} />

          <SelectFilter
            label="Status"
            placeholder="All"
            value={status}
            onChange={setStatus}
            options={[
              { label: "All", value: "" },
              { label: "Draft", value: "DRAFT" },
              { label: "Assigned", value: "ASSIGNED" },
              { label: "Completed", value: "COMPLETED" }
            ]}
          />

        </div>

      </SearchBox>

      <div className="flex justify-end mt-[65px]">

        <button
          className="flex items-center px-7 py-3 gap-1.5 bg-white shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-2 border-green-700 rounded-md text-xs text-green-700 font-normal"
        >
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

    </div>

  );
}