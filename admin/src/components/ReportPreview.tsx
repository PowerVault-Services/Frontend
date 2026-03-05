interface Props {
  data: {
    reportUrl?: string
  } | null
}

export default function ReportPreview({ data }: Props) {

  if (!data?.reportUrl) {
    return (
      <div
        style={{
          background: "#000",
          padding: 16,
          borderRadius: 8,
          height: 449,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff"
        }}
      >
        กำลังโหลดรายงาน...
      </div>
    )
  }

  const pdfURL = `http://localhost:3000${data.reportUrl}`

  return (
    <div
      style={{
        backgroundColor: "#000",
        padding: 16,
        borderRadius: 8,
        height: 449
      }}
    >
      <iframe
        src={pdfURL}
        width="100%"
        height="100%"
        style={{
          border: "none",
          background: "#fff"
        }}
      />
    </div>
  )
}