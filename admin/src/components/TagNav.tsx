import TagChip from "./TagChip";

interface TagItem {
  id: string;
  label: string;
}

interface TagNavProps {
  items: TagItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function TagNav({
  items,
  activeId,
  onChange,
  className = "",
}: TagNavProps) {
  return (
    <div className={`flex ${className}`}>
      {items.map((item) => (
        <TagChip
          key={item.id}
          label={item.label}
          active={item.id === activeId}
          onClick={() => onChange(item.id)}
        />
      ))}
    </div>
  );
}
