interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {

  const pages: (number | string)[] = [];

  if (totalPages <= 5) {

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

  } else {

    pages.push(1);

    if (page > 3) pages.push("...");

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages);
  }

  return (
    <div className="flex items-center gap-2">

      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="w-9 h-9 flex items-center justify-center border rounded-md bg-white text-gray-400"
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === "..." ? (

          <span
            key={`ellipsis-${i}`}
            className="px-2 text-gray-400"
          >
            ...
          </span>

        ) : (

          <button
            key={`page-${p}-${i}`}
            onClick={() => onChange(Number(p))}
            className={`w-9 h-9 flex items-center justify-center rounded-md border
              ${page === p
                ? "border-[#356A2E] text-[#356A2E] font-medium bg-white"
                : "border-gray-300 text-gray-500 bg-white"
              }`}
          >
            {p}
          </button>

        )
      )}

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="w-9 h-9 flex items-center justify-center border rounded-md bg-white text-gray-400"
      >
        ›
      </button>

    </div>
  );
}