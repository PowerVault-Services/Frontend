import { useState } from "react";
import TagNav from "../../../components/TagNav";
import PVsystTab from "./PVsystTab";
import WarrantyEnergy from "./WarrantyEnergy";

const ForecastTags = [
  { id: "PVsyst", label: "PVsyst" },
  { id: "Warranty Energy Output", label: "Warranty Energy Output" },
];

interface Props {
  project: any;
}


export default function ForecastDetailTab({ project }: Props) {
  const [activeTab, setActiveTab] = useState("PVsyst");

  const renderTab = () => {
    switch (activeTab) {
      case "PVsyst":
        return <PVsystTab siteId={project?.siteId} />
      case "Warranty Energy Output":
        return <WarrantyEnergy siteId={project?.siteId} />;
      default:
        return null;
    }
  };

  return (
    <div className="px-[34px] py-[34px]">
      <TagNav
        items={ForecastTags}
        activeId={activeTab}
        onChange={setActiveTab}
      />
      <div className="px-[27px] py-[63px] flex justify-center-safe border border-green-800 bg-white rounded-b-lg">
        {renderTab()}
      </div>
    </div>
  );
}
