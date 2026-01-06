import { useState } from "react";
import SearchBox from "../SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";

export default function ActiveAlarmsTab() {
  const [pvModule, setPvModule] = useState("");
  const [] = useState("all");

  return (
    <div className="flex flex-col gap-[18px]">
      <SearchBox>
        <div className="grid grid-cols-5 gap-4">
          <SelectFilter
            label="Project Name"
            placeholder="All"
            value={pvModule}
            onChange={setPvModule}
            options={[
                { label: "All", value: "all" },
                { label: "Project A", value: "project_a" },
                { label: "Project B", value: "project_b" },
                ]}
            />

          <TextInputFilter
            label="SN"
            value={pvModule}
            onChange={setPvModule}
          />

          <TextInputFilter
            label="Alarm Name"
            value={pvModule}
            onChange={setPvModule}
          />
          
            <TextInputFilter
            label="Alarm ID"
            value={pvModule}
            onChange={setPvModule}
            />

            <SelectFilter
            label="Occurrence time"
            placeholder="All"
            value={pvModule}
            onChange={setPvModule}
            options={[
                { label: "All", value: "all" },
                { label: "Project A", value: "project_a" },
                { label: "Project B", value: "project_b" },
                ]}
            />
        </div>
      </SearchBox>
    </div>
  );
}
