import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ZipIcon from "../../assets/icons/ZIP File.svg";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import DataTable, { type Column } from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";

import { getInspectionJobs } from "../../services/inspection.api";
import { downloadInspectionZip } from "../../services/inspection.api";

import EditIcon from "../../assets/icons/Pen New Square.svg";
import DeleteIcon from "../../assets/icons/Paper Bin.svg";

interface Inspection {
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

  const navigate = useNavigate();


  const [data, setData] = useState<Inspection[]>([]);
  const [time, setTime] = useState("");
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

  const fetchInspection = async () => {

    try {

      setLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize)
      });

      if (jobNo) params.append("jobNo", jobNo);
      if (projectType) params.append("projectType", projectType);
      if (projectName) params.append("projectName", projectName);
      if (systemSize) params.append("systemSizeKWp", systemSize);
      if (date) params.append("date", date);
      if (status) params.append("status", status);

      const json = await getInspectionJobs(`?${params.toString()}`);
      console.log("🔥 inspection list:", json.data);
      const list = json.data ?? [];


      const mapped: Inspection[] = list.map((item: any) => ({
        id: item.jobId,
        jobnumber: item.jobNo,
        projectType: item.projectType,
        projectName: item.projectName,
        systemSize: item.systemSizeKWp,
        date: item.date?.slice(0, 10),
        time: item.time,
        status: item.status
      }));

      setData(mapped);
      setTotalItems(json.pagination?.total ?? 0);

    } catch (err) {

      console.error("โหลด inspection jobs ไม่สำเร็จ:", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchInspection();
  }, [page, jobNo, projectType, projectName, systemSize, date, status]);

  const resetFilters = () => {

    setJobNo("");
    setProjectType("");
    setProjectName("");
    setSystemSize("");
    setDate("");
    setStatus("");
    setPage(1);

  };

  const handleEdit = (row: Inspection) => {
    const inspectionData = {
      jobId: row.id,
      jobNo: row.jobnumber,
      projectName: row.projectName,
      projectType: row.projectType,
      systemSizeKWp: row.systemSize,
      date: row.date,
      time: row.time,
      status: row.status,
    };

    // ✅ ใช้ key ของ inspection
    localStorage.setItem("inspection_step1", JSON.stringify(inspectionData));
    localStorage.setItem("jobId", row.id.toString());

    // ✅ mapping ตาม flow จริง
    switch (row.status) {
      case "DRAFT":
        navigate("/inspection/new/step1");
        break;

      case "SENT":
        navigate("/inspection/new/step3");
        break;

      case "COMPLETED":
        navigate("/inspection/new/step3");
        break;
    }
  };

  // ===== HANDLE DELETE (ทำงานจริง: ลบจาก State และแจ้งเตือน) =====
  const handleDelete = async (id: number) => {
    if (!confirm("คุณต้องการลบรายการนี้ใช่หรือไม่? ข้อมูลที่บันทึกไว้จะหายไป")) return;

    try {
      // หมายเหตุ: ตรงนี้ควรเพิ่มการเรียก API ลบจริง เช่น await deleteCleaningJob(id);
      setData(prev => prev.filter(r => r.id !== id));
      setSelectedRows(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      // alert("ลบรายการสำเร็จ");
    } catch (err) {
      alert("ไม่สามารถลบข้อมูลได้");
    }
  };

  const handleCreateNew = () => {
    // 🚩 ล้างข้อมูลที่เคยค้างอยู่ทั้งหมด เพื่อให้หน้า Step 1 เปิดมาเป็นฟอร์มว่าง
    localStorage.removeItem("jobId");
    localStorage.removeItem("inspection_step1");
    localStorage.removeItem("siteId");

    // นำทางไปหน้า Step 1
    navigate("/inspection/new/step1");
  };

  const handleDownloadZip = () => {
    if (selectedRows.size === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 รายการ");
      return;
    }

    const ids = Array.from(selectedRows);

    console.log("📦 Download inspection:", ids);

    downloadInspectionZip(ids); // ✅ ตัวนี้สำคัญ
  };

  const statusBadge = (status: string) => {

    const base = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (status) {

      case "COMPLETED":
        return (
          <span className={`${base} bg-green-100 text-green-700`}>
            Completed
          </span>
        );

      case "SENT":
        return (
          <span className={`${base} bg-blue-100 text-blue-700`}>
            Sent
          </span>
        );

      case "DRAFT":
        return (
          <span className={`${base} bg-gray-200 text-gray-700`}>
            Draft
          </span>
        );

      default:
        return (
          <span className={`${base} bg-gray-100 text-gray-600`}>
            {status}
          </span>
        );
    }

  };

  const columns: Column<Inspection>[] = [

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
        <div className="flex items-center gap-3 justify-center">
          <button onClick={() => handleEdit(row)} className="hover:opacity-70 transition-opacity" title="Edit">
            <img src={EditIcon} alt="Edit" className="w-5 h-5" />
          </button>
          <button onClick={() => handleDelete(row.id)} className="hover:opacity-70 transition-opacity" title="Delete">
            <img src={DeleteIcon} alt="Delete" className="w-5 h-5" />
          </button>
        </div>
      )
    }

  ];

  return (
    <div className="w-full">

      <div className="flex justify-between pb-9">

        <h1 className="text-green-800">Inspection</h1>

        <Link to="/inspection/new/step1">
          <button className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5">
            <img src={AddIcon} alt="" />
            New Inspection Job
          </button>
        </Link>

      </div>

      <SearchBox onReset={resetFilters} onSearch={() => setPage(1)}>

        <div className="grid grid-cols-4 gap-2.5">

          <TextInputFilter label="Job No." value={jobNo} onChange={setJobNo} />

          <SelectFilter
            label="Project Type"
            placeholder="All"
            value={projectType}
            onChange={setProjectType}
            options={[
              { label: "All", value: "" },
              { label: "EPC", value: "EPC" },
              { label: "PPA", value: "PPA" },
            ]}
          />
          <TextInputFilter label="Project Name" value={projectName} onChange={setProjectName} />
          <TextInputFilter label="System Size (kWp)" value={systemSize} onChange={setSystemSize} />
          <TextInputFilter label="Date" type="date" value={date} onChange={setDate} />
          <TextInputFilter label="Time" type="time" value={time} onChange={setTime} />
          <SelectFilter
            label="Status"
            placeholder="All"
            value={status}
            onChange={setStatus}
            options={[
              { label: "All", value: "" },
              { label: "Draft", value: "DRAFT" },
              { label: "Sent", value: "SENT" },
              { label: "Completed", value: "COMPLETED" }
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

        <DataTable<Inspection>
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