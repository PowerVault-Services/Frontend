import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import CleangingIcon from "../assets/icons/cleaning.svg";
import InspectionIcon from "../assets/icons/inspection.svg";
import ServiceIcon from "../assets/icons/service.svg";
import OMIcon from "../assets/icons/AddAngleIcon.svg";

interface Props {
  plantId?: number;
  onClose: () => void;
  isOpen: boolean;
}

export default function CreateReportModal({ plantId, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const navigate = useNavigate();

  const [type, setType] = useState<"cleaning" | "inspection" | "service" | "om" | "">("");
  const [plantName, setPlantName] = useState("");

  const handleNext = () => {
    if (!plantName || !type) {
      alert("กรุณากรอก Plant และเลือก Job Type");
      return;
    }

    // เก็บไว้ใช้ step ต่อไป
    localStorage.setItem("newPlantName", plantName);
    localStorage.setItem("jobType", type);

    if (type === "cleaning") {
      navigate(`/client-data/service/new`);
    }

    if (type === "inspection") {
      navigate(`/client-data/service/new`);
    }

    if (type === "service") {
      navigate(`/client-data/service/new`);
    }

    if (type === "om") {
      navigate(`/client-data/service/new`);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200">

        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
          <h3 className="text-xl font-bold text-green-800">
            Create New Service Job
          </h3>
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Plant Name */}
          <div>
            <label className="block text-[16px] mb-2">
              Plant Name
            </label>
            <input
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="กรอกชื่อโครงการ"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          {/* Job Type Cards */}
          <div className="grid gap-4">
            <label className="block text-[16px]">
              Job Type
            </label>
            {/* Cleaning */}
            <label className="relative block cursor-pointer group">
              <input
                type="radio"
                className="peer hidden"
                checked={type === "cleaning"}
                onChange={() => setType("cleaning")}
              />
              <div className="p-5 border-2 rounded-2xl flex gap-4 transition-all
                border-slate-100
                peer-checked:border-green-600 peer-checked:bg-green-50
                hover:border-green-400">
                
                <div className="size-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <img src={CleangingIcon} />
                </div>

                <div>
                  <h5 className="font-bold">Cleaning Service</h5>
                  <p className="text-sm text-slate-500 mt-1">
                    Panel cleaning and efficiency optimization.
                  </p>
                </div>
              </div>
            </label>

            {/* Inspection */}
            <label className="relative block cursor-pointer group">
              <input
                type="radio"
                className="peer hidden"
                checked={type === "inspection"}
                onChange={() => setType("inspection")}
              />
              <div className="p-5 border-2 rounded-2xl flex gap-4 transition-all
                border-slate-100
                peer-checked:border-blue-600 peer-checked:bg-blue-50
                hover:border-blue-400">
                
                <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <img src={InspectionIcon} />
                </div>

                <div>
                  <h5 className="font-bold">Inspection</h5>
                  <p className="text-sm text-slate-500 mt-1">
                    System inspection and audit.
                  </p>
                </div>
              </div>
            </label>

            {/* Service */}
            <label className="relative block cursor-pointer group">
              <input
                type="radio"
                className="peer hidden"
                checked={type === "service"}
                onChange={() => setType("service")}
              />
              <div className="p-5 border-2 rounded-2xl flex gap-4 transition-all
                border-slate-100
                peer-checked:border-purple-600 peer-checked:bg-purple-50
                hover:border-purple-400">
                
                <div className="size-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <img src={ServiceIcon} />
                </div>

                <div>
                  <h5 className="font-bold">Service</h5>
                  <p className="text-sm text-slate-500 mt-1">
                    Maintenance and technical service.
                  </p>
                </div>
              </div>
            </label>

            {/* O&M */}
            <label className="relative block cursor-pointer group">
              <input
                type="radio"
                className="peer hidden"
                checked={type === "om"}
                onChange={() => setType("om")}
              />
              <div className="p-5 border-2 rounded-2xl flex gap-4 transition-all
                border-slate-100
                peer-checked:border-orange-600 peer-checked:bg-orange-50
                hover:border-orange-400">
                
                <div className="size-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <img src={OMIcon} />
                </div>

                <div>
                  <h5 className="font-bold">O&M</h5>
                  <p className="text-sm text-slate-500 mt-1">
                    Operation & Maintenance monitoring.
                  </p>
                </div>
              </div>
            </label>

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-2.5 rounded-xl bg-green-700 text-white hover:bg-green-800"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}