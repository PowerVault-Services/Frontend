import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ZipIcon from "../../assets/icons/ZIP File.svg";
import AddIcon from "../../assets/icons/Add Circle.svg";
import DataTable, { type Column } from "../../components/table/DataTable";

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

export default function HomeInspection() {
  const [data, setData] = useState<Cleaning[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/cleaning")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
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

  const columns: Column<Cleaning>[] = [
    {
      key: "id",
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

    { key: "jobnumber", label: "Job No.", align: "center" },
    { key: "projectType", label: "Project Type", align: "center" },
    { key: "projectName", label: "Project Name", align: "center" },
    { key: "systemSize", label: "System Size (kWp)", align: "center" },
    { key: "date", label: "Date", align: "center" },
    { key: "time", label: "Time", align: "center" },
    { key: "status", label: "Status", align: "center" },

    {
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
          <TextInputFilter label="Job No." value={""} onChange={() => {}} />

          <SelectFilter
            label="Project Type"
            placeholder="All"
            value={""}
            onChange={() => {}}
            options={[
              { label: "All", value: "all" },
              { label: "Project A", value: "project_a" },
              { label: "Project B", value: "project_b" },
            ]}
          />

          <TextInputFilter label="Project Name" value={""} onChange={() => {}} />
          <TextInputFilter label="System Size (kWp)" value={""} onChange={() => {}} />
          <TextInputFilter label="PV Module (ea.)" value={""} onChange={() => {}} />
          <TextInputFilter label="Date" type="date" value={""} onChange={() => {}} />
          <TextInputFilter label="Time" type="time" value={""} onChange={() => {}} />

          <SelectFilter
            label="รับเหมา"
            placeholder="All"
            value={""}
            onChange={() => {}}
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
            onChange={() => {}}
            options={[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
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
        <DataTable<Cleaning> columns={columns} data={data} loading={loading} />
      </div>
    </div>
  );
}
