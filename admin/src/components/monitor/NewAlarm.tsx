interface NewAlarmProps {
  alarmName: string;
  date: string;
  time: string;
}

export default function NewAlarm({ alarmName, date, time }: NewAlarmProps) {
  return (
    <div className="max-w-[464px] h-[46px] border-2 border-green-400 rounded-lg bg-white px-6 py-0.5 flex items-center justify-between gap-[51px]">
      
      {/* Alarm Name */}
      <div className="text-green-700 text-lg font-bold">
        {alarmName}
      </div>

      {/* Date */}
      <div className="text-sm text-black">
        {date}
      </div>

      {/* Time */}
      <div className="text-sm text-black">
        {time}
      </div>

    </div>
  );
}