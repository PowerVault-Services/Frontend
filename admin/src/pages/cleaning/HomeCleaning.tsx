import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ZipIcon from "../../assets/icons/ZIP File.svg";
import AddIcon from "../../assets/icons/Add Circle.svg";
import DataTable, { type Column } from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";

import { getCleaningJobs } from "../../services/api";

interface Cleaning {
  id: number;
  jobnumber: string;
  projectType: string;
  projectName: string;
  systemSize: number;
  date: string;
  time: string;
  status: string;
}

export default function HomeCleaning() {
  const [data, setData] = useState<Cleaning[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const [page, setPage] = useState(1);
  const pageSize = 13;

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = data.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    const load = async () => {
      const res = await getCleaningJobs();

      const mapped = res.map((item: any) => ({
        id: item.jobId,              // ⭐ แก้ตรงนี้
        jobnumber: item.jobNo,
        projectType: item.projectType,
        projectName: item.projectName,
        systemSize: item.systemSizeKWp,
        date: item.date,
        time: item.time,
        status: item.status,
      }));

      setData(mapped);
      setLoading(false);
    };

    load();
  }, []);

  const handleEdit = (row: Cleaning) => {
    console.log("Edit:", row);
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

  const handleDownloadZip = () => {
    if (selectedRows.size === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 รายการ");
      return;
    }

    const ids = Array.from(selectedRows);

    console.log("Download jobs:", ids);

  };

  const columns: Column<Cleaning>[] = [
    {
      id: "checkbox",
      label: "",
      align: "center",
      render: (_, row) => (
        <input
          key={row.id}
          type="checkbox"
          checked={selectedRows.has(row.id)}
          onChange={(e) => {
            const checked = e.target.checked;

            setSelectedRows((prev) => {
              const next = new Set(prev);

              if (checked) {
                next.add(row.id);
              } else {
                next.delete(row.id);
              }

              return next;
            });
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
    { id: "status", key: "status", label: "Status", align: "center" },

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
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between pb-9">
        <h1 className="text-green-800">Cleaning</h1>

        <Link to="/cleaning/new/step1">
          <button className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5">
            <img src={AddIcon} alt="" />
            New Cleaning Job
          </button>
        </Link>
      </div>

      <SearchBox>
        <div className="grid grid-cols-4 justify-between gap-2.5">
          <TextInputFilter label="Job No." value={""} onChange={() => { }} />

          <SelectFilter
            label="Project Type"
            placeholder="All"
            value={""}
            onChange={() => { }}
            options={[
              { label: "All", value: "all" },
              { label: "Project A", value: "project_a" },
              { label: "Project B", value: "project_b" },
            ]}
          />

          <TextInputFilter label="Project Name" value={""} onChange={() => { }} />

          <TextInputFilter
            label="System Size (kWp)"
            value={""}
            onChange={() => { }}
          />

          <TextInputFilter label="PV Module (ea.)" value={""} onChange={() => { }} />

          <TextInputFilter
            label="Date"
            type="date"
            value={""}
            onChange={() => { }}
          />

          <TextInputFilter
            label="Time"
            type="time"
            value={""}
            onChange={() => { }}
          />

          <SelectFilter
            label="รับเหมา"
            placeholder="All"
            value={""}
            onChange={() => { }}
            options={[
              { label: "All", value: "all" },
              { label: "Project A", value: "project_a" },
              { label: "Project B", value: "project_b" },
            ]}
          />

          <SelectFilter
            label="Status"
            placeholder="All"
            value={""}
            onChange={() => { }}
            options={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
            ]}
          />
        </div>
      </SearchBox>

      <div className="flex justify-end mt-[65px]">
        <button
          onClick={handleDownloadZip}
          className="flex items-center px-7 py-3 gap-1.5 bg-white shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-2 border-green-700 rounded-md text-xs text-green-700 font-normal"
        >
          <img src={ZipIcon} alt="" />
          ดาวน์โหลด zip file ({selectedRows.size})
        </button>
      </div>

      <div className="pt-[25px]">
        <DataTable<Cleaning>
          columns={columns}
          data={paginatedData}
          loading={loading}
        />
        <div className="flex items-center justify-between mt-6 text-sm text-gray-500 ">

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