import { useState } from "react";
import TagNav from "../../../components/TagNav";
import WarrantySupplier from "./WarrantySupplier";

const WarrantyTags = [
  { id: "Warranty with Supplier", label: "Warranty with Supplier" },
  { id: "Warranty for Customer", label: "Warranty for Customer" },
];

export default function WarrantyDetailTab() {

  const [activeProject, setActiveProject] = useState<string>("Warranty with Supplier");

  const renderTabContent = () => {
    switch (activeProject) {
      case "Warranty with Supplier":
        return <WarrantySupplier />;
      case "Warranty for Customer":
        return <div>Warranty for Customer</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center-safe py-[39px] px-[39px] w-full h-auto">
      <div className="w-[1420px]">
        <TagNav
          items={WarrantyTags}
          activeId={activeProject}
          onChange={setActiveProject}
        />
        <div className="border border-green-800 bg-white rounded-b-lg px-[27px] py-[13px] min-h-[200px]">
            {renderTabContent()}
        </div>  
      </div>
    </div>
  );
}
