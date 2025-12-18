interface FlowLineProps {
  d: string;          // path ของเส้น
  active?: boolean;
}

export default function FlowLine({ d, active = false }: FlowLineProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      viewBox="0 0 400 400"
    >
      {/* เส้นพื้น */}
      <path
        d={d}
        fill="none"
        stroke="#2AC1E6"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* เส้น animation */}
      {active && (
        <path
          d={d}
          fill="none"
          stroke="#2FB4E9"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="6 10"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-32"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      )}
    </svg>
  );
}
