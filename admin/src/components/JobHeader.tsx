import { JOB_CONFIG, type JobType } from "../configs/jobConfig";

interface Props {
  job: JobType;
}

export default function JobHeader({ job }: Props) {
  const config = JOB_CONFIG[job];

  return (
    <div
      className={`
        w-[356px] h-[59px] flex items-center justify-center -top-24 left-[60px]
        rounded-b-xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]
        ${config.headerBg}
      `}
    >
      <h2 className={` font-bold ${config.textColor}`}>
        {config.label}
      </h2>
    </div>
  );
}
