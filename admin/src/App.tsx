import { useState } from "react";
import SearchBox from "./components/SearchBox";
import Sidebar from "./components/Sidebar";
import TextInputFilter from "./components/TextInputFilter";
import TagNav from "./components/TagNav";
import ProgressBar from "./components/progress/ProgressBar";

function App() {
  const [pvModule, setPvModule] = useState("");
  const [activeProject, setActiveProject] = useState("th");
  const [currentStep] = useState(1);
  

  const projectTags = [
  { id: "th", label: "PowerVault (Thailand)" },
  { id: "vn", label: "PowerVault (Vietnam)" },
  { id: "my", label: "PowerVault (Malaysia)" },
  ];

  const steps = [
  { id: 1, label: "กรอกข้อมูล" },
  { id: 2, label: "ส่งอีเมลแจ้งแผน" },
  { id: 3, label: "แนบรูปภาพ" },
  { id: 4, label: "รายงาน" },
  { id: 5, label: "ส่งรายงาน" },
  ];
  

  return (
    <div className="flex min-h-screen bg-green-100">
      {/* Sidebar ด้านซ้าย */}
      <Sidebar />

      {/* เนื้อหาหลักฝั่งขวา */}
      <main className="flex-1 bg-green-100">
        {/* 🔹 content container ตามกริด Figma */}
        <div className="max-w-[1319px] mx-auto pt-10 pb-12">

          {/* SearchBox กว้างเต็ม container */}
          <SearchBox>
            <div className="grid grid-cols-3 gap-4">
              <TextInputFilter
                label="Device Name"
                value={pvModule}
                onChange={setPvModule}
              />
              <TextInputFilter
                label="Device Name"
                value={pvModule}
                onChange={setPvModule}
              />
              <TextInputFilter
                label="Device Name"
                value={pvModule}
                onChange={setPvModule}
              />
            </div>
          </SearchBox>

          {/* ด้านล่างค่อยเป็น table / เนื้อหาอื่น ๆ */}
          {/* ... */}
          <div className="max-w-[1319px] mx-auto pt-6">
          {/* Tag navigation */}
            <TagNav
              items={projectTags}
              activeId={activeProject}
              onChange={(id) => setActiveProject(id)}
              className="mb-6"
            />
          </div>
          <div className="max-w-[760px] mx-auto mt-6">
            <ProgressBar
              steps={steps}
              currentStep={currentStep}
            />

          {/* เนื้อหาแต่ละ step */}
          {/* แสดงฟอร์มตาม currentStep */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
