
interface TextInputFilterProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "time" | "number";
}

export default function TextInputFilter({
  label,
  placeholder = "Select",
  value,
  onChange,
  type = "text",
}: TextInputFilterProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[16px] font-normal text-green-800">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full h-[39px]
          rounded-sm
          border border-green-200
          bg-white
          px-4
          text-[14px]
          text-green-500
          font-normal
          placeholder:text-green-300


        "
      />
    </div>
  );
}
