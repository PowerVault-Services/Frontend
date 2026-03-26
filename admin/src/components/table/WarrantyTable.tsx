import { Fragment } from "react/jsx-runtime";

type WarrantyItem = {
  id: number;
  category: string;
  itemName: string;
  supplierName?: string;
  productName?: string;
  quantity?: number;
  startWarranty?: string;
  endWarranty?: string;
  warrantyYears?: number;
};

interface Props {
  data?: WarrantyItem[];
}

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

const categoryMap: Record<string, string> = {
  "Solar Panels": "SOLAR_PANEL",
  "Inverter & Monitoring System": "INVERTER",
  "Inverter & Rapid Shutdown": "INVERTER",
  "Power Optimizer": "OPTIMIZER",
};

export default function WarrantyTable({ data = [] }: Props) {

  const findRow = (sectionTitle: string, itemName: string) => {

    const mappedCategory = categoryMap[sectionTitle];

    return data.find(
      (row) =>
        row.category === mappedCategory &&
        row.itemName?.toLowerCase().includes(itemName.toLowerCase())
    );
  };

  return (
    <div className="border border-green-800 rounded-2xl overflow-hidden">
      <table className="w-full text-xs font-semibold border-collapse">

        {/* HEADER */}
        <thead className="bg-green-800 text-white h-9">
          <tr className="border-b" style={{ borderColor: "#DEE2E6" }}>
            <th
              className="px-4 py-3 w-[369px] border-r"
              style={{ borderColor: "#DEE2E6" }}
            ></th>

            {[
              "Supplier Name",
              "Product Name",
              "จำนวน",
              "Start Warranty",
              "End Warranty",
              "Warranty (Y)",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-center w-[133px] border-r last:border-r-0"
                style={{ borderColor: "#DEE2E6" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {warrantySections.map((section, sIndex) => (
            <Fragment key={sIndex}>

              {/* CATEGORY */}
              <tr className="border-b" style={{ borderColor: "#DEE2E6" }}>
                <td
                  className="px-4 py-2 border-r"
                  style={{ borderColor: "#DEE2E6" }}
                >
                  {section.title}
                </td>
                <td colSpan={6}></td>
              </tr>

              {/* ITEMS */}
              {section.items.map((item, iIndex) => {

                const row = findRow(section.title, item);

                return (
                  <tr
                    key={iIndex}
                    className="border-b"
                    style={{ borderColor: "#DEE2E6" }}
                  >
                    <td
                      className="px-6 py-2 font-normal border-r"
                      style={{ borderColor: "#DEE2E6" }}
                    >
                      - {item}
                    </td>

                    <td className="border-r text-center">
                      {row?.supplierName ?? ""}
                    </td>

                    <td className="border-r text-center">
                      {row?.productName ?? ""}
                    </td>

                    <td className="border-r text-center">
                      {row?.quantity ?? ""}
                    </td>

                    <td className="border-r text-center">
                      {row?.startWarranty ?? ""}
                    </td>

                    <td className="border-r text-center">
                      {row?.endWarranty ?? ""}
                    </td>

                    <td className="text-center">
                      {row?.warrantyYears ?? ""}
                    </td>

                  </tr>
                );

              })}

            </Fragment>
          ))}
        </tbody>

      </table>
    </div>
  );
}