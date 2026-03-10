import React, { useId } from "react";

interface FlowLineProps {
  d: string;          // path ของเส้น
  active?: boolean;   // สถานะว่ามีการไหลของพลังงานหรือไม่
  stroke?: string;    // สีของเส้นและจุดวิ่ง (Default เป็นสีเทา)
}

export default function FlowLine({ d, active = false, stroke = "#DEE2E6" }: FlowLineProps) {
  // สร้าง ID แบบสุ่มที่ไม่ซ้ำกัน เพื่อป้องกันบั๊กเวลาเรามีหลายๆ เส้นในหน้าเดียวกัน
  // แล้วค่า id ไปซ้ำกันจนจุดวิ่งสลับเส้น
  const pathId = useId();

  return (
    <g>
      {/* 1. เส้น Track พื้นฐาน (แสดงให้เห็นรูปทรงของเส้น) */}
      <path
        id={pathId}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        // ถ้าไม่มีไฟไหล ให้เส้นดูจางมากๆ (0.1) แต่ถ้ามีไฟไหลให้เข้มขึ้นนิดนึง (0.3)
        opacity={active ? 0.3 : 0.1} 
      />

      {/* 2. จุดวงกลมที่จะวิ่งตามเส้น (แสดงเฉพาะตอน active) */}
      {active && (
        <circle r="3" fill={stroke}>
          <animateMotion
            dur="1.5s"             // ความเร็วในการวิ่ง (ยิ่งค่าน้อย ยิ่งวิ่งเร็ว เช่น 1s, 0.5s)
            repeatCount="indefinite" // ให้วิ่งวนลูปไปเรื่อยๆ
            calcMode="linear"      // ให้วิ่งด้วยความเร็วคงที่
          >
            {/* mpath จะเป็นตัวบอกให้วงกลมวิ่งเกาะไปตาม id ของเส้นด้านบน */}
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </circle>
      )}
    </g>
  );
}