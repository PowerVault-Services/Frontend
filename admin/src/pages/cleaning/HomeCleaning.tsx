import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ZipIcon from "../../assets/icons/ZIP File.svg";
import AddIcon from "../../assets/icons/Add Circle_line.svg";
import DataTable, { type Column } from "../../components/table/DataTable";
import Pagination from "../../components/table/Pagination";
import EditIcon from "../../assets/icons/Pen New Square.svg";
import DeleteIcon from "../../assets/icons/Paper Bin.svg";
import EyeIcon from "../../assets/icons/EyeIcon.svg";

import { getCleaningJobs } from "../../services/cleaning.api";
import { downloadCleaningZip } from "../../services/cleaning.api";

interface Cleaning {
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

export default function HomeCleaning() {
  const navigate = useNavigate();

  // ===== DATA STATES =====
  const [data, setData] = useState<Cleaning[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  // ===== PAGINATION STATES =====
  const [page, setPage] = useState(1);
  const pageSize = 13;
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / pageSize);

  // ===== FILTER STATES =====
  const [jobNo, setJobNo] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectName, setProjectName] = useState("");
  const [systemSize, setSystemSize] = useState("");
  const [pvModuleEA, setPvModuleEA] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");

  // ===== CHECKBOX LOGIC =====
  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const partiallySelected = selectedRows.size > 0 && selectedRows.size < data.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  // ===== FETCH DATA =====
  const fetchCleaning = async () => {
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
      if (pvModuleEA) params.append("pvModuleEA", pvModuleEA);
      if (date) params.append("date", date);
      if (status) params.append("status", status);

      const json = await getCleaningJobs(`?${params.toString()}`);
      const list = json.data ?? [];

      const mapped: Cleaning[] = list.map((item: any) => ({
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
    } catch (err) {
      console.error("โหลด Cleaning Jobs ไม่สำเร็จ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCleaning();
  }, [page, jobNo, projectType, projectName, systemSize, pvModuleEA, date, status, time]);


  // ===== HANDLE EDIT (ทำงานจริง: ส่งไปหน้า Step ตาม Status) =====
  const handleEdit = (row: Cleaning) => {
    const cleaningData = {
      jobId: row.id,
      jobNo: row.jobnumber,
      projectName: row.projectName,
      projectType: row.projectType,
      systemSizeKWp: row.systemSize,
      pvModuleEA: row.pvModuleEA,
      date: row.date,
      time: row.time,
      status: row.status,
    };

    // 1. เก็บข้อมูลลง localStorage เพื่อให้ Step 1-5 ดึงไปใช้ต่อ
    localStorage.setItem("cleaning_step1", JSON.stringify(cleaningData));

    if (row.status === "COMPLETED") {
      navigate("/cleaning/new/step1");
      return;
    }

    // 2. เช็ค Status เพื่อเลือกหน้าที่จะส่งไป (แก้ไขเนื้อหาที่บันทึกไว้)
    switch (row.status) {
      case "DRAFT":
        navigate("/cleaning/new/step1");
        break;
      case "PENDING":
        // ถ้าเคยส่งอีเมลแจ้งแผนแล้ว (Step 2 เสร็จ) ให้ไปหน้าแนบรูป (Step 3)
        navigate("/cleaning/new/step3_01");
        break;
      case "IN_PROGRESS":
        // ถ้ากำลังทำงาน ให้ไปหน้าทำรายงาน (Step 4)
        navigate("/cleaning/new/step4");
        break;
      default:
        navigate("/cleaning/new/step1");
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
    localStorage.removeItem("cleaning_step1");
    localStorage.removeItem("siteId");

    // นำทางไปหน้า Step 1
    navigate("/cleaning/new/step1");
  };

  const statusBadge = (status: string) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "COMPLETED": return <span className={`${base} bg-green-100 text-green-700`}>Completed</span>;
      case "PENDING": return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "DRAFT": return <span className={`${base} bg-gray-200 text-gray-700`}>Draft</span>;
      case "IN_PROGRESS": return <span className={`${base} bg-blue-100 text-blue-700`}>In Progress</span>;
      case "CANCELLED": return <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>;
      default: return <span className={`${base} bg-gray-100 text-gray-600`}>{status}</span>;
    }
  };

  const columns: Column<Cleaning>[] = [
    {
      id: "checkbox",
      label: (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={(e) => {
            if (e.target.checked) setSelectedRows(new Set(data.map(r => r.id)));
            else setSelectedRows(new Set());
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
    { id: "pvModuleEA", key: "pvModuleEA", label: "PV Module EA", align: "center" },
    { id: "date", key: "date", label: "Date", align: "center" },
    { id: "time", key: "time", label: "Time", align: "center" },
    { id: "status", key: "status", label: "Status", align: "center", render: (value) => statusBadge(value) },
    {
      id: "actions",
      key: "id",
      label: "Actions",
      align: "center",
      render: (_, row) => {
        // ✅ ย้าย Logic เข้ามาใน Block { } ของ render function
        const isCompleted = row.status === "COMPLETED";

        return (
          <div className="flex items-center gap-3 justify-center">
            {isCompleted ? (
              // 👁️ แสดงปุ่ม Preview ถ้าสถานะเป็น COMPLETED
              <button
                onClick={() => handleEdit(row)}
                className="hover:opacity-70 transition-opacity"
                title="Preview"
              >
                <img src={EyeIcon} alt="Preview" className="w-5 h-5" />
              </button>
            ) : (
              // ✏️ แสดงปุ่ม Edit และ Delete ถ้าสถานะไม่ใช่ COMPLETED
              <>
                <button
                  onClick={() => handleEdit(row)}
                  className="hover:opacity-70 transition-opacity"
                  title="Edit"
                >
                  <img src={EditIcon} alt="Edit" className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="hover:opacity-70 transition-opacity"
                  title="Delete"
                >
                  <img src={DeleteIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  const handleResetSearch = () => {
    setJobNo("");
    setProjectType("");
    setProjectName("");
    setSystemSize("");
    setPvModuleEA("");
    setDate("");
    setTime("");
    setStatus("");

    setPage(1);
  };

  const handleSearch = () => {
    setPage(1); // trigger fetch
  };

  const handleDownloadZip = () => {
    if (selectedRows.size === 0) {
      alert("กรุณาเลือกอย่างน้อย 1 รายการ");
      return;
    }

    const ids = Array.from(selectedRows);

    console.log("📦 Download:", ids);

    downloadCleaningZip(ids); // ✅ ตัวนี้แหละสำคัญ
  };

  return (
    <div className="w-full">
      <div className="flex justify-between pb-9">
        <h1 className="text-green-800 text-2xl font-bold">Cleaning</h1>
        <Link to="/cleaning/new/step1">
          <button
            onClick={handleCreateNew}
            className="flex items-center px-7 py-3 bg-green-700 text-white rounded-md text-[15px] font-normal gap-5 hover:bg-green-800">
            <img src={AddIcon} alt="" />
            New Cleaning Job
          </button>
        </Link>
      </div>

      <SearchBox onReset={handleResetSearch} onSearch={handleSearch}>
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
          <TextInputFilter label="PV Module (ea.)" value={pvModuleEA} onChange={setPvModuleEA} />
          <TextInputFilter label="Date" type="date" value={date} onChange={setDate} />
          <TextInputFilter label="Time" type="time" value={time} onChange={setTime} />
          <SelectFilter
            label="Status"
            placeholder="All"
            value={status}
            onChange={setStatus}
            options={[
              { label: "All", value: "" },
              { label: "Pending", value: "PENDING" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Draft", value: "DRAFT" }
            ]}
          />
        </div>
      </SearchBox>

      <div className="flex justify-end mt-[65px]">
        <button
          onClick={handleDownloadZip}
          className="flex items-center px-7 py-3 gap-1.5 bg-white shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)] border-2 border-green-700 rounded-md text-xs text-green-700 font-normal hover:bg-green-50"
        >
          <img src={ZipIcon} alt="" />
          ดาวน์โหลด zip file ({selectedRows.size})
        </button>
      </div>

      <div className="pt-[25px]">
        <DataTable<Cleaning> columns={columns} data={data} loading={loading} />
        <div className="flex items-center justify-between py-6 text-sm text-gray-500">
          <span>Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} items</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}