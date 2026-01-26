import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import PRTable from "../../components/table/PRTable";

export default function PRMonitor() {
    return (
        <div className="w-full">
            <h1 className="text-green-800 pb-9">%PR</h1>
            <div className="pb-[62px]">
                            <SearchBox>
                <div className="grid grid-cols-2 justify-between gap-2.5">
                    <TextInputFilter label="Time Granularity" value={""} onChange={() => { }} />
                    <SelectFilter
                        label="Statistical Period"
                        placeholder="All"
                        value={""}
                        onChange={() => { }}
                        options={[
                            { label: "All", value: "all" },
                            { label: "Pending", value: "pending" },
                            { label: "Completed", value: "completed" },
                        ]}
                    />
                </div>
            </SearchBox>
            </div>
            <PRTable>
            </PRTable>
        </div>
    );
}