import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import CleangingIcon from "../assets/icons/cleaning.svg";
import InspectionIcon from "../assets/icons/inspection.svg";
import ServiceIcon from "../assets/icons/service.svg";

interface Props {
  plantId?: number;
  onClose: () => void;
}

export default function CreateReportModal({ plantId, onClose }: Props) {
  const navigate = useNavigate();
  const [type, setType] = useState<"cleaning" | "inspection" | "service">("cleaning");

  const handleNext = () => {
  if (type === "cleaning") {
    navigate(`/cleaning/new/step1?plantId=${plantId}`);
  }

  if (type === "inspection") {
    navigate(`/inspection/new/step1?plantId=${plantId}`);
  }

  if (type === "service") {
    navigate(`/service/new/step1?plantId=${plantId}`);
  }
};

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-[520px] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-xl font-bold text-green-800">
            Create New Report
          </h2>
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Cleaning Service Option */}
            <label className="relative block group cursor-pointer">
              <input
                type="radio"
                name="report_type"
                className="peer hidden"
                checked={type === "cleaning"}
                onChange={() => setType("cleaning")}
              />
              <div className="p-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl peer-checked:border-green-600 peer-checked:bg-green-50 transition-all hover:border-green-500/50 hover:bg-green-100/25 flex gap-4">
                <div className="size-12 rounded-xl bg-green-100 flex items-center justify-center text-primary shrink-0">
                  <img src={CleangingIcon} alt="Cleaning Service" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    Cleaning Service
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Schedule or log panel cleaning activities to optimize light absorption and efficiency.
                  </p>
                </div>
                <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
            </label>

            {/* Inspection Report Option */}
            <label className="relative block group cursor-pointer">
              <input
                type="radio"
                name="report_type"
                className="peer hidden"
                checked={type === "inspection"}
                onChange={() => setType("inspection")}
              />
              <div className="p-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all hover:border-blue-500/50 hover:bg-blue-100/25 flex gap-4">
                <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 shrink-0">
                  <img src={InspectionIcon} alt="Inspection Report" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    Inspection Report
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Comprehensive technical audit of inverters, mounting structures, and electrical wiring.
                  </p>
                </div>
                <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
            </label>

            {/* Service Report Option */}
            <label className="relative block group cursor-pointer">
              <input
                type="radio"
                name="report_type"
                className="peer hidden"
                checked={type === "service"}
                onChange={() => setType("service")}
              />
              <div className="p-5 border-2 border-slate-100 dark:border-slate-800 rounded-2xl peer-checked:border-purple-600 peer-checked:bg-purple-50 transition-all hover:border-purple-500/50 hover:bg-purple-100/25 flex gap-4">
                <div className="size-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 shrink-0">
                  <img src={ServiceIcon} alt="Service Report" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                    Service Report
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Log regular operations, maintenance activities, and technical servicing.
                  </p>
                </div>
                <div className="absolute top-4 right-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-2.5 rounded-xl font-bold bg-primary text-white bg-green-700 hover:bg-green-800 transition-all shadow-md shadow-green-500/20"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}