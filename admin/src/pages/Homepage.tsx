import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SearchBox from "../components/SearchBox";
import PlantStatusCard from "../components/cards/PlantStatusCard";
import AlarmCard from "../components/cards/AlarmCard";
import { useEffect, useState } from "react";
import TextInputFilter from "../components/TextInputFilter";
import SelectFilter from "../components/SelectFilter";
import DataTable from "../components/table/DataTable";

interface Plant {
  status: string;
  plantName: string;
  address: string;
  gridDate: string;
  capacity: number;
}

export default function Homepage() {
  const [pvModule, setPvModule] = useState("");
  const [deviceType, setDeviceType] = useState("");


  const [data, setData] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plants")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      key: "status",
      label: "Status",
      render: () => (
        <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
      ),
      align: "center",
    },
    { key: "plantName", label: "Plant Name" },
    { key: "address", label: "Address" },
    { key: "gridDate", label: "Grid Connection Date" },
    {
      key: "capacity",
      label: "Total String Capacity (kWp)",
    },
    {
      key: "capacity",
      label: "Optimizer Quantity",
    },
    {
      key: "capacity",
      label: "Current Power (kW)",
    },
    {
      key: "capacity",
      label: "Specific Energy (kWh/kWp)",
    },
    {
      key: "capacity",
      label: "Yield Today (kWh)",
    },
    {
      key: "capacity",
      label: "Total Yield (kWh)",
    },
    {
      key: "capacity",
      label: "Performance Ratio (%)",
    }
  ] as const;

  

  return (
    <MainLayout>
      <div className="w-auto h-auto px-[50px] py-[30px]">
        {/* Top Cards */}
        <div className="bg-white grid grid-cols-1 lg:grid-cols-3 px-[50px] py-[30px] rounded-2xl justify-between">
          <PlantStatusCard />
          <AlarmCard />

          {/* Notification Alarms */}
          <div className="max-w-[303px]">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notification Alarms</h3>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[50px] w-auto border border-[#DEE2E6] px-3.5 py-1.5 rounded-lg"
                >
                  <div className="flex justify-between text-sm font-regular">
                    <span>Plant Name</span>
                    <span className="text-gray-400">Now</span>
                  </div>
                  <p className="text-xs text-black">Detail</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* search bar */}
        <div className="mt-6">
          <SearchBox>
            <div className="grid grid-cols-4 gap-4">
              <TextInputFilter
                label="Plant Name"
                value={pvModule}
                onChange={setPvModule}
              />
              <TextInputFilter
                label="Country/Region"
                value={pvModule}
                onChange={setPvModule}
              />
              <SelectFilter
                label="Device type"
                placeholder="All"
                value={deviceType}
                onChange={setDeviceType}
                options={[
                  { label: "All", value: "all" },
                  { label: "Inverter", value: "inverter" },
                  { label: "Optimizer", value: "optimizer" },
                ]}
              />

              <TextInputFilter
                label="Device SN"
                value={pvModule}
                onChange={setPvModule}
              />
            </div>
          </SearchBox>
        </div>

        {/* data table */}
        <div className="mt-6">
          <DataTable<Plant>
            columns={columns}
            data={data}
            loading={loading}
          />
        </div>
      </div>
    </MainLayout>
  );
}
