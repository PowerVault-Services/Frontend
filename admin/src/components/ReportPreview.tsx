import type { OperationResult } from "./table/OperationTable";

interface Props {
  data: OperationResult[];
}

export default function ReportPreview({ data:_ }: Props) {
  return (
    <div
      style={{
        backgroundColor: "#000000",
        padding: 16,
        borderRadius: 8,
        height: 449,
        overflowY: "auto"
      }}
    >
      <div
        id="report-preview"
        style={{
          backgroundColor: "#FFFFFF",
          width: "794px",
          minHeight: "1123px",
          margin: "0 auto",
          padding: 40,
          fontSize: 12,
          color: "#000000"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #000", paddingBottom: 16 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ width: 56, height: 56, backgroundColor: "#E5E5E5" }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>POWER VAULT</div>
              <div style={{ fontSize: 11, color: "#555" }}>บริษัท พาวเวอร์วอลต์ (ประเทศไทย) จำกัด</div>
            </div>
          </div>

          <div style={{ fontSize: 11, textAlign: "right", lineHeight: 1.5 }}>
            402 หมู่ 2 ต.สำโรงเหนือ<br />
            อ.เมืองสมุทรปราการ<br />
            จ.สมุทรปราการ 10270
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 14, margin: "24px 0", textDecoration: "underline" }}>
          รายงานการตรวจสอบและทำความสะอาดระบบโซลาร์เซลล์
        </div>

      </div>
    </div>
  );
}
