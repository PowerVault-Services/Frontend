import React from "react";
import ProgressStepIcon from "../progress/ProgressStepIcon";

interface ProgressStep {
  id: number;
  label: string;
}

interface ProgressBarProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export default function ProgressBar({
  steps,
  currentStep,
  className = "",
}: ProgressBarProps) {
  return (
    <div className={`flex items-start w-[760px] mx-auto ${className}`}>
      {steps.map((step, index) => {
        const stepIndex = index + 1;

        let status: "complete" | "current" | "upcoming" = "upcoming";
        if (stepIndex < currentStep) status = "complete";
        else if (stepIndex === currentStep) status = "current";

        return (
          <React.Fragment key={step.id}>
            {/* กล่อง step กว้างเท่ากับวงกลมแล้ว */}
            <ProgressStepIcon
              step={stepIndex}
              label={step.label}
              status={status}
            />

            {/* เส้นเชื่อม */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-[#949494] mt-5" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
