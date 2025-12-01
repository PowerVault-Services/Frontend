interface ProgressStepIconProps {
  step: number;
  label: string;
  status?: "complete" | "current" | "upcoming";
  onClick?: () => void;
}

export default function ProgressStepIcon({
  step,
  label,
  status = "upcoming",
  onClick,
}: ProgressStepIconProps) {
  const isComplete = status === "complete";
  const isCurrent = status === "current";

  return (
    <div className="relative z-10 flex flex-col items-center w-10">
      {/* วงกลมตัวเลข */}
      <button
        type="button"
        onClick={onClick}
        className={`
          flex items-center justify-center
          w-10 h-10
          rounded-full
          text-xl font-medium
          focus:outline-none
          bg-transparent
          border
          ${
            isCurrent
              ? "border-green-800 text-green-800"
              : isComplete
              ? "border-green-800 bg-green-800 text-white"
              : "border-[#8D8D8D] text-[#A8A8A8]"
          }
        `}
      >
        {step}
      </button>

      {/* label ลอยใต้ปุ่ม */}
      <span
        className={`
          absolute top-12 left-1/2 -translate-x-1/2
          whitespace-nowrap
          text-base font-normal
          ${
            isCurrent || isComplete
              ? "text-black"
              : "text-[#8D8D8D]"
          }
        `}
      >
        {label}
      </span>
    </div>
  );
}
