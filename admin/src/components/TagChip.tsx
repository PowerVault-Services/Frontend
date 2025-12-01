interface TagChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function TagChip({
  label,
  active = false,
  onClick,
  className = "",
}: TagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center justify-center
        px-3.5 py-[5px]
        rounded-t-2xl
        text-sm
        transition-colors duration-150
        ${active
          ? "bg-green-900  text-white"        
          : "bg-[#EBEBEB]  text-[#878787]"    
        }
        ${className}
      `}
    >
      {label}
    </button>
  );
}
