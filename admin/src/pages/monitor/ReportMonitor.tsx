import { useState, useMemo } from 'react';
import SearchBox from "../../components/SearchBox";
import TextInputFilter from "../../components/TextInputFilter";
import SelectFilter from "../../components/SelectFilter";
import ReportViewe from './ReportView';


const ALL_MONTHS = [
    { label: "มกราคม", value: "1" },
    { label: "กุมภาพันธ์", value: "2" },
    { label: "มีนาคม", value: "3" },
    { label: "เมษายน", value: "4" },
    { label: "พฤษภาคม", value: "5" },
    { label: "มิถุนายน", value: "6" },
    { label: "กรกฎาคม", value: "7" },
    { label: "สิงหาคม", value: "8" },
    { label: "กันยายน", value: "9" },
    { label: "ตุลาคม", value: "10" },
    { label: "พฤศจิกายน", value: "11" },
    { label: "ธันวาคม", value: "12" },
];

export default function ReportMonitor() {
    // เพิ่ม State สำหรับ ProjectName เพื่อให้ Reset ได้ครบถ้วน
    const [projectName, setProjectName] = useState<string>("");
    const [startMonth, setStartMonth] = useState<string>("");
    const [endMonth, setEndMonth] = useState<string>("");

    const startMonthOptions = useMemo(() => {
        if (!endMonth) return ALL_MONTHS;
        return ALL_MONTHS.filter((m) => parseInt(m.value) <= parseInt(endMonth));
    }, [endMonth]);

    const endMonthOptions = useMemo(() => {
        if (!startMonth) return ALL_MONTHS;
        return ALL_MONTHS.filter((m) => parseInt(m.value) >= parseInt(startMonth));
    }, [startMonth]);

    // ฟังก์ชัน Reset: เคลียร์ค่า State ทุกตัวให้เป็นค่าว่าง
    const handleReset = () => {
        setProjectName("");
        setStartMonth("");
        setEndMonth("");
        console.log("Reset filters");
    };

    // ฟังก์ชัน Search: 
    const handleSearch = () => {
        const filterData = {
            projectName,
            startMonth,
            endMonth
        };
        console.log("Searching with:", filterData);
        // TODO: เรียก API หรือ Filter ข้อมูลตรงนี้
    };

    return (
        <div className="w-full">
            <h1 className="text-green-800 pb-9">Report</h1>
            <div className="pb-[62px]">
                {/* ส่ง onReset และ onSearch เข้าไปที่ SearchBox */}
                <SearchBox 
                    onReset={handleReset} 
                    onSearch={handleSearch}
                >
                    <div className="grid grid-cols-3 justify-between gap-2.5">
                        <TextInputFilter 
                            label="ProjectName" 
                            value={projectName} 
                            onChange={(e: any) => setProjectName(e.target.value)} 
                        />
                        <SelectFilter
                            label="Start Month"
                            placeholder="เลือกเดือนเริ่มต้น"
                            value={startMonth}
                            onChange={(val: any) => setStartMonth(val)} 
                            options={startMonthOptions}
                        />
                        <SelectFilter
                            label="End Month"
                            placeholder="เลือกเดือนสิ้นสุด"
                            value={endMonth}
                            onChange={(val: any) => setEndMonth(val)}
                            options={endMonthOptions}
                        />
                    </div>
                </SearchBox>
            </div>
            <ReportViewe></ReportViewe>
        </div>
    );
}