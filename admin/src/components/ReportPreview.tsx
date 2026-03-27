interface Props { data: { fileUrl?: string } | null }

export default function ReportPreview({ data }: Props) {
  console.log("📄 ReportPreview data:", data);

  if (!data?.fileUrl) {
    return (
      <div style={{
        background: "#000",
        padding: 16,
        borderRadius: 8,
        height: 449,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff"
      }}>
        กำลังโหลดรายงาน...
      </div>
    );
  }

  // ✅ แก้แล้ว
  const pdfURL = data.fileUrl.startsWith("http")
    ? data.fileUrl
    : `${import.meta.env.VITE_API_URL}${data.fileUrl}`;

  return (
    <div style={{
      backgroundColor: "#000",
      padding: 16,
      borderRadius: 8,
      height: 449
    }}>
      <iframe
        src={pdfURL}
        width="100%"
        height="100%"
        style={{ border: "none", background: "#fff" }}
      />
    </div>
  );
}