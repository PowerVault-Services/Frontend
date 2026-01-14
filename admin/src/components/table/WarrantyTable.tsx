import { Fragment } from "react/jsx-runtime";

type WarrantyRow = {
  title: string;
  items: string[];
};

const warrantySections: WarrantyRow[] = [
  { title: "Solar Panels", items: ["Linear Power Warranty", "Product Warranty"] },
  { title: "Inverter & Monitoring System", items: ["Product Warranty"] },
  { title: "Inverter & Rapid Shutdown", items: ["Product Warranty"] },
  { title: "Power Optimizer", items: ["Product Warranty", "Product Warranty"] },
];

export default function WarrantyTable() {
  return (
    <div className="border border-green-800 rounded-2xl overflow-hidden">
      <table className="text-xs font-semibold border-collapse">
        <thead className="bg-green-800 text-white h-[36px]">
          <tr className="border-b" style={{ borderColor: "#DEE2E6" }}>
            <th className="px-4 py-3 w-[369px] border-r" style={{ borderColor: "#DEE2E6" }}></th>
            {["Supplier Name","Product Name","จำนวน","Start Warranty","End Warranty","Warranty (Y)"].map((h) => (
              <th key={h} className="px-4 py-3 text-center w-[133px] border-r last:border-r-0" style={{ borderColor: "#DEE2E6" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {warrantySections.map((section, sIndex) => (
            <Fragment key={sIndex}>
              <tr className="border-b" style={{ borderColor: "#DEE2E6" }}>
                <td className="px-4 py-2 border-r" style={{ borderColor: "#DEE2E6" }}>
                  {section.title}
                </td>
                <td colSpan={6}></td>
              </tr>

              {section.items.map((item, iIndex) => (
                <tr key={iIndex} className="border-b" style={{ borderColor: "#DEE2E6" }}>
                  <td className="px-6 py-2 font-normal border-r" style={{ borderColor: "#DEE2E6" }}>
                    - {item}
                  </td>
                  {[...Array(6)].map((_, i) => (
                    <td key={i} className="border-r last:border-r-0" style={{ borderColor: "#DEE2E6" }} />
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
