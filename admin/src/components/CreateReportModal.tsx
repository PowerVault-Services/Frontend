import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  plantId?: number;
  onClose: () => void;
}

export default function CreateReportModal({ plantId, onClose }: Props) {

  const navigate = useNavigate();
  const [type, setType] = useState<"cleaning" | "inspection" | "service">("cleaning");

  const handleNext = () => {

    if (type === "cleaning") {
      navigate(`/service/cleaning/new?plantId=${plantId}`);
    }

    if (type === "inspection") {
      navigate(`/service/inspection/new?plantId=${plantId}`);
    }

    if (type === "service") {
        navigate(`/service/om/new?plantId=${plantId}`);
    }

  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white w-[480px] rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          Create New Report
        </h2>

        <div className="space-y-3">

          <label className="flex gap-3 border p-4 rounded-lg cursor-pointer">
            <input
              type="radio"
              checked={type === "cleaning"}
              onChange={() => setType("cleaning")}
            />
            Cleaning Service
          </label>

          <label className="flex gap-3 border p-4 rounded-lg cursor-pointer">
            <input
              type="radio"
              checked={type === "inspection"}
              onChange={() => setType("inspection")}
            />
            Inspection Report
          </label>

          <label className="flex gap-3 border p-4 rounded-lg cursor-pointer">
            <input
              type="radio"
              checked={type === "service"}
              onChange={() => setType("service")}
            />
            Service Report
          </label>

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button onClick={onClose}>
            Cancel
          </button>

          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}